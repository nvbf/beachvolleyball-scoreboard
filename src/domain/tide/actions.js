import { Map, List } from "immutable";
import debug from "debug";
import { Actions } from "tide";
import sendMailClient from "../../util/sendMailClient";

import {
  Match,
  MATCH,
  ACTION_HISTORY,
  HISTORY,
  MATCH_ID,
  HOMETEAM_POINT,
  AWAYTEAM_POINT,
  HOMETEAM_TIMEOUT_TAKEN,
  AWAYTEAM_TIMEOUT_TAKEN,
  DATE,
  ACTION,
  VALUE,
  MATCHSTATE,
  State,
  Action,
  UNDO,
  ActionHistory,
  CURRENT_SET,
  BeachVolleyballSet,
  constants as c,
  TOURNAMENT_PRIVATE_ID,
  MATCH_FIREBASE_KEY
} from "./state";

import { update as storeToLocalStorage } from "./storage";

import {
  getHometeamPointsInCurrentSet,
  getAwayteamPointsInCurrentSet,
  getCurrentSetIndex,
  getCurrentSet,
  isMatchFinished,
  isSetFinished
} from "./logic";

class AllAction extends Actions {
  mutateAndTrack(key, value) {
    console.log("mutateAndTrack", key, value);
    this.mutate(key, original => (original = value));
    this.mutate(HISTORY, history => {
      return history.push(
        new Action({
          DATE: new Date(),
          ACTION: key,
          VALUE: value,
          MATCHSTATE: this.getMatch()
        })
      );
    });
    this.track(key, value);
  }

  appendAndTrack(key, value) {
    console.log("appendAndTrack", key, value);
    this.mutate(key, original => {
      console.log(original);
      return original.push(value);
    });
    this.mutate(HISTORY, history => {
      return history.push(
        new Action({
          DATE: new Date(),
          ACTION: key,
          VALUE: value,
          MATCHSTATE: this.getMatch()
        })
      );
    });
    this.track(key, value);
  }

  track = (key, value) => {
    console.log("track");
    const state = this.getMatch();
    const index = getCurrentSetIndex(state);
    const action = new ActionHistory({
      [c.DATE]: new Date(),
      [c.ACTION]: key,
      [VALUE]: value,
      [c.HOMETEAM_POINT]: this.get([MATCH, index, HOMETEAM_POINT]),
      [c.AWAYTEAM_POINT]: this.get([MATCH, index, AWAYTEAM_POINT]),
      [c.CURRENT_SET]: index
    });
    this.mutate(ACTION_HISTORY, history => history.push(action));
    const matchId = this.get([MATCH, MATCH_FIREBASE_KEY]);
    storeToLocalStorage(matchId, this.getState());
  };

  hometeamTakeTimeout = (proxy, event, state = this.getMatch()) => {
    const index = getCurrentSetIndex(state);
    this.mutateAndTrack([MATCH, index, HOMETEAM_TIMEOUT_TAKEN], true);
    this.showComponent(c.SHOW_TO);
  };

  awayteamTakeTimeout = (proxy, event, state = this.getMatch()) => {
    const index = getCurrentSetIndex(state);
    this.mutateAndTrack([MATCH, index, AWAYTEAM_TIMEOUT_TAKEN], true);
    this.showComponent(c.SHOW_TO);
  };

  addPointHometeam = (proxy, event, state = this.getState()) => {
    const matchState = state[c.MATCH];
    const index = getCurrentSetIndex(matchState);
    const currentSet = getCurrentSet(state);
    const currentPoints = getAwayteamPointsInCurrentSet(matchState);
    const currentPoints2 = getHometeamPointsInCurrentSet(matchState);

    const newPoints = currentPoints2 + 1;
    const totalPOints = currentPoints + newPoints;
    const newScore = new BeachVolleyballSet({
      [c.HOMETEAM_POINT]: currentSet[c.HOMETEAM_POINT] + 1,
      [c.AWAYTEAM_POINT]: currentSet[c.AWAYTEAM_POINT]
    });

    this.setNotificationsState(state, newScore, totalPOints);
    this.mutateAndTrack([MATCH, index, HOMETEAM_POINT], newPoints);
  };

  addPointAwayteam = (proxy, event, state = this.getState()) => {
    const matchState = state[c.MATCH];
    const index = getCurrentSetIndex(matchState);
    const currentSet = getCurrentSet(state);
    const currentPoints = getAwayteamPointsInCurrentSet(matchState);
    const currentPoints2 = getHometeamPointsInCurrentSet(matchState);
    const newPoints = currentPoints + 1;
    const totalPoints = newPoints + currentPoints2;

    const newScore = new BeachVolleyballSet({
      [c.HOMETEAM_POINT]: currentSet[c.HOMETEAM_POINT],
      [c.AWAYTEAM_POINT]: currentSet[c.AWAYTEAM_POINT] + 1
    });

    this.setNotificationsState(state, newScore, totalPoints);
    this.mutateAndTrack([MATCH, index, AWAYTEAM_POINT], newPoints);
  };

  notificationOk = (proxy, event, state = this.getState()) => {
    this.showScoreboard();
  };

  showAddHomeTeam = () => {
    this.showComponent(c.ADD_HOMETEAM_COMPONENT);
  };

  async setNotificationsState(state, newScore, totalPoints) {
    console.log("setNotificationsState", state);
    const match = state[c.MATCH];
    const isLastSet = getCurrentSetIndex(match) === c.THIRD_SET;
    const switchOnPoint = isLastSet
      ? match[c.LAST_SET_SWITCH_EVERY_X_POINT]
      : match[c.DEFAULT_SWITCH_EVERY_X_POINT];
    const newMatchState = Match({
      [c.FIRST_SET]:
        getCurrentSetIndex(match) === c.FIRST_SET
          ? newScore
          : match[c.FIRST_SET],
      [c.SECOND_SET]:
        getCurrentSetIndex(match) === c.SECOND_SET
          ? newScore
          : match[c.SECOND_SET],
      [c.THIRD_SET]:
        getCurrentSetIndex(match) === c.THIRD_SET
          ? newScore
          : match[c.THIRD_SET]
    });
    const pointsInSet = isLastSet
      ? match[c.LAST_SET_LENGTH]
      : match[c.DEFAULT_SET_LENGTH];
    if (isMatchFinished(newMatchState)) {
      sendMailClient(state);
      this.mutate([c.MATCH, c.MATCH_FINISHED_TIMESTAMP], new Date().getTime());
      this.mutate([c.MATCH, c.SHOW_COMPONENT], c.SHOW_MATCH_FINISHED);
      //TODO: should this be here?
      this.mutate([c.MATCH, c.MATCH_IS_FINISED], true);
    } else if (isSetFinished(newScore, pointsInSet)) {
      this.mutate([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SET_FINISHED);
    } else if (totalPoints === 21 && !isLastSet) {
      this.mutate([c.MATCH, c.SHOW_COMPONENT], c.SHOW_TTO);
    } else if (totalPoints % switchOnPoint === 0) {
      this.mutate([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SWITCH);
    }
  }

  playerOnHomeTeamToServe = player => {
    assert(player === 1 || player === 2, "player should be one of 1 or 2.");
    const state = this.getMatch();
    const index = getCurrentSetIndex(state);
    const firstServer =
      player === 1
        ? this.getMatch()[c.HOMETEAM_FIRST_PLAYER_NAME]
        : this.getMatch()[c.HOMETEAM_SECOND_PLAYER_NAME];
    const secondServer =
      player === 2
        ? this.getMatch()[c.HOMETEAM_FIRST_PLAYER_NAME]
        : this.getMatch()[c.HOMETEAM_SECOND_PLAYER_NAME];
    const serviceOrder = new List([firstServer, secondServer]);
    this.mutateAndTrack([MATCH, index, c.SERVICE_ORDER_HOMETEAM], serviceOrder);
    this.handleServiceOrderDialogPath(c.HOMETEAM);
  };

  playerOnAwayTeamToServe = player => {
    assert(player === 1 || player === 2, "player should be one of 1 or 2.");
    const state = this.getMatch();
    const currentSetIndex = getCurrentSetIndex(state);
    const firstServer =
      player === 1
        ? this.getMatch()[c.AWAYTEAM_FIRST_PLAYER_NAME]
        : this.getMatch()[c.AWAYTEAM_SECOND_PLAYER_NAME];
    const secondServer =
      player === 2
        ? this.getMatch()[c.AWAYTEAM_FIRST_PLAYER_NAME]
        : this.getMatch()[c.AWAYTEAM_SECOND_PLAYER_NAME];
    const serviceOrder = new List([firstServer, secondServer]);
    this.mutateAndTrack(
      [MATCH, currentSetIndex, c.SERVICE_ORDER_AWAYTEAM],
      serviceOrder
    );
    this.handleServiceOrderDialogPath(c.AWAYTEAM);
  };

  handleServiceOrderDialogPath(team) {
    const state = this.getMatch();
    const currentSetIndex = getCurrentSetIndex(state);
    const currentSet = this.getMatch()[currentSetIndex];

    console.log(
      "currentSet[c.FIRST_TEAM_TO_SERVE]",
      currentSet[c.FIRST_TEAM_TO_SERVE],
      team
    );
    if (currentSet[c.FIRST_TEAM_TO_SERVE] === team) {
      const nextDialog =
        team === c.HOMETEAM
          ? c.SHOW_SERVICE_ORDER_DIALOG_PLAYER_AWAYTEAM
          : c.SHOW_SERVICE_ORDER_DIALOG_PLAYER_HOMETEAM;
      console.log("nextDialog", nextDialog);
      this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], nextDialog);
    } else {
      this.mutateAndTrack([MATCH, c.SERVICE_ORDER_IS_SET], true);
      this.mutateAndTrack(
        [MATCH, currentSetIndex, c.SERVICE_ORDER_IS_SET],
        true
      );
      this.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SCOREBOARD_COMPONENT);
    }
  }

  teamToServe = team => {
    const state = this.getMatch();
    console.log("team", team);
    assert(
      team === c.HOMETEAM || team === c.AWAYTEAM,
      "team should be one of HOMETEAM or AWAYTEAM constants"
    );
    const index = getCurrentSetIndex(state);
    this.mutateAndTrack([MATCH, index, c.FIRST_TEAM_TO_SERVE], team);
    if (team === c.HOMETEAM) {
      this.mutateAndTrack(
        [c.MATCH, c.SHOW_COMPONENT],
        c.SHOW_SERVICE_ORDER_DIALOG_PLAYER_HOMETEAM
      );
    } else {
      this.mutateAndTrack(
        [c.MATCH, c.SHOW_COMPONENT],
        c.SHOW_SERVICE_ORDER_DIALOG_PLAYER_AWAYTEAM
      );
    }
  };

  showComponent = component => {
    this.mutate([c.MATCH, c.SHOW_COMPONENT], component);
  };

  showScoreboard = () => {
    this.showComponent(c.SCOREBOARD_COMPONENT);
  };

  load = state => {
    console.log("LOAD!!");
    console.log(state);
    this.setState(state);
  };

  getMatch = () => {
    return this.get(MATCH);
  };

  undo = () => {
    console.log("UNDO");
    const history = this.get([HISTORY]);
    const secondLastAction = history.pop().last();
    const matchState = secondLastAction.get(MATCHSTATE);

    const undoAction = [UNDO].concat(secondLastAction.get(ACTION));
    this.mutate(MATCH, original => (original = matchState));
    this.mutate(HISTORY, original => (original = history.pop()));
    this.track(undoAction, secondLastAction.get(VALUE));
  };

  getPersonsName = (serving, number) => {
    const index = number % 2;
    const bvSet = this.getCurrentSet();
    if (serving === c.HOMETEAM) {
      return bvSet[c.SERVICE_ORDER_HOMETEAM].get(index);
    }
    return bvSet[c.SERVICE_ORDER_AWAYTEAM].get(index);
  };

  getCurrentSet = (match = this.getMatch()) => {
    const index = getCurrentSetIndex(match);
    return this.getMatch()[index];
  };

  addComment = comment => {
    this.appendAndTrack([c.MATCH, c.COMMENTS], comment);
    this.showScoreboard();
  };

  addEmail = email => {
    this.mutateAndTrack([c.MATCH, c.EMAIL], email);
    this.showScoreboard();
  };

  addTournamentId = tournamentId => {
    this.mutateAndTrack([c.MATCH, c.TOURNAMENT_PRIVATE_ID], tournamentId);
    this.showScoreboard();
  };

  addMatchId = matchId => {
    this.mutateAndTrack([c.MATCH, c.MATCH_ID], matchId);
  };
}

function assert(bool, message) {
  if (!bool) {
    throw message;
  }
}

export default AllAction;
