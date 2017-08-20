import React from "react";
import url from "url";
import { wrap } from "tide";
import firebase from "firebase";
import { getUID } from "../src/util/auth";

import AddHomeTeam from "./../src/components/components/add-home-team";
import AddAwayTeam from "./../src/components/components/add-away-team";
import Scoreboard from "./../src/components/components/scoreboard";
import ServiceOrderDialogTeam from "./../src/components/molokyler/service-order-team-dialog";
import ServiceOrderDialogPlayer from "./../src/components/molokyler/service-order-player-dialog";
import NotificationDialog from "./../src/components/templates/notifications";
import AddCommentsDialog from "./../src/components/molokyler/add-comments-dialog";
import AddEmailDialog from "./../src/components/molokyler/add-email-dialog";
import SecondCounter from "./../src/components/molokyler/second-counter";
import AddTournamentIdDialog from "./../src/components/molokyler/add-tournamentid-dialog";

import {
  HOMETEAM_FIRST_PLAYER_NAME,
  HOMETEAM_SECOND_PLAYER_NAME,
  HOMETEAM_COLOR,
  AWAYTEAM_FIRST_PLAYER_NAME,
  AWAYTEAM_SECOND_PLAYER_NAME,
  AWAYTEAM_COLOR,
  MATCH,
  SHOW_COMPONENT,
  ADD_AWAYTEAM_COMPONENT,
  ADD_HOMETEAM_COMPONENT,
  SCOREBOARD_COMPONENT,
  LOADING_COMPONENT,
  SHOW_SERVICE_ORDER_DIALOG_TEAM,
  SHOW_SERVICE_ORDER_DIALOG_PLAYER_AWAYTEAM,
  SHOW_SERVICE_ORDER_DIALOG_PLAYER_HOMETEAM,
  constants as c
} from "../src/domain/tide/state";

import { get as getStateFromLocalStorage } from "./../src/domain/tide/storage";

import { ButtonToolbar, Button } from "react-bootstrap";

class Main extends React.Component {
  async componentDidMount() {
    console.log("componentDidMount");
    const qs = url.parse(document.location.search, true).query;
    if (qs.name1 && qs.name2 && qs.name3 && qs.name4) {
      const matchKey = await this.setStateFromQs(qs);
      createCorrectQueryString(matchKey);
      return;
    }

    if (qs.new !== true) {
      console.log("qs.key", qs.key);
      const state = getStateFromLocalStorage(qs.key);
      if (state !== false) {
        console.log("loading from state");
        this.props.tide.actions.all.load(state);
        return;
      } else {
      }
    }

    const matchKey = await this.initMatch();
    createCorrectQueryString(matchKey);
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, SHOW_COMPONENT],
      ADD_HOMETEAM_COMPONENT
    );
  }

  initMatch = async (qs = {}) => {
    const uid = await getUID();
    const key = firebase.database().ref(`${c.MATCH_PATH}`).push({
      userId: uid
    }).key;
    console.log("key?????", key);
    this.props.tide.actions.all.mutateAndTrack(
      [c.MATCH, c.MATCH_FIREBASE_KEY],
      key
    );

    const matchId = qs.matchid || `${Math.random() * 100000000000000000}`;
    this.props.tide.actions.all.mutateAndTrack([c.MATCH, c.MATCH_ID], matchId);

    this.props.tide.actions.all.mutateAndTrack(
      [c.MATCH, c.TOURNAMENT_PRIVATE_ID],
      qs.tournamentid || 0
    );
    return key;
  };

  setStateFromQs(qs) {
    const matchKey = this.initMatch(qs);
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
      qs.name1
    );
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
      qs.name2
    );
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, HOMETEAM_COLOR],
      qs.color1 ? `#${qs.color1}` : "#ff0000"
    );

    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
      qs.name3
    );
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
      qs.name4
    );
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, AWAYTEAM_COLOR],
      qs.color2 ? `#${qs.color2}` : "#0000ff"
    );
    this.props.tide.actions.all.mutateAndTrack(
      [MATCH, SHOW_COMPONENT],
      SCOREBOARD_COMPONENT
    );
    return matchKey;
  }

  render() {
    console.log("render main");
    const {
      HOMETEAM_FIRST_PLAYER_NAME,
      HOMETEAM_SECOND_PLAYER_NAME,
      HOMETEAM_COLOR,
      AWAYTEAM_FIRST_PLAYER_NAME,
      AWAYTEAM_SECOND_PLAYER_NAME,
      AWAYTEAM_COLOR
    } = this.props;

    const show = this.props[SHOW_COMPONENT];
    console.log("show:", show);

    if (show === ADD_HOMETEAM_COMPONENT) {
      return (
        <main>
          <AddHomeTeam />
        </main>
      );
    } else if (show === ADD_AWAYTEAM_COMPONENT) {
      return (
        <main>
          <AddAwayTeam />
        </main>
      );
    } else if (show === LOADING_COMPONENT) {
      return (
        <main>
          <div>Loading...</div>
        </main>
      );
    } else if (show === SHOW_SERVICE_ORDER_DIALOG_TEAM) {
      return (
        <main>
          <div>
            <ServiceOrderDialogTeam />
          </div>
        </main>
      );
    } else if (show === SHOW_SERVICE_ORDER_DIALOG_PLAYER_AWAYTEAM) {
      return (
        <main>
          <div>
            <ServiceOrderDialogPlayer
              player1={AWAYTEAM_FIRST_PLAYER_NAME}
              player2={AWAYTEAM_SECOND_PLAYER_NAME}
              color={AWAYTEAM_COLOR}
              action="playerOnAwayTeamToServe"
              team="away team"
            />
          </div>
        </main>
      );
    } else if (show === SHOW_SERVICE_ORDER_DIALOG_PLAYER_HOMETEAM) {
      return (
        <main>
          <div>
            <ServiceOrderDialogPlayer
              player1={HOMETEAM_FIRST_PLAYER_NAME}
              player2={HOMETEAM_SECOND_PLAYER_NAME}
              color={HOMETEAM_COLOR}
              action="playerOnHomeTeamToServe"
              team="home team"
            />
          </div>
        </main>
      );
    } else if (show === c.SHOW_TTO) {
      return (
        <main>
          <NotificationDialog>
            Technical Timeout - <SecondCounter />
          </NotificationDialog>
        </main>
      );
    } else if (show === c.SHOW_TO) {
      return (
        <main>
          <NotificationDialog>
            Timeout - <SecondCounter />
          </NotificationDialog>
        </main>
      );
    } else if (show === c.SHOW_SWITCH) {
      return (
        <main>
          <NotificationDialog>Switch</NotificationDialog>
        </main>
      );
    } else if (show === c.SHOW_SET_FINISHED) {
      return (
        <main>
          <NotificationDialog>Set finished</NotificationDialog>
        </main>
      );
    } else if (show === c.SHOW_MATCH_FINISHED) {
      return (
        <main>
          <NotificationDialog>Match Finished</NotificationDialog>
        </main>
      );
    } else if (show === c.SHOW_COMMENTS_DIALOG) {
      return (
        <main>
          <AddCommentsDialog />
        </main>
      );
    } else if (show === c.SHOW_EMAIL_DIALOG) {
      return (
        <main>
          <AddEmailDialog />
        </main>
      );
    } else if (show === c.SHOW_TOURNAMENT_COMPONENT) {
      return (
        <main>
          <AddTournamentIdDialog />
        </main>
      );
    }

    return (
      <section>
        <main>
          <Scoreboard />
        </main>
      </section>
    );
  }
}

function createCorrectQueryString(matchKey) {
  window.history.pushState({}, "", `/match?key=${matchKey}`);
}

export default wrap(Main, {
  [HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
  [HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
  [HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR],
  [AWAYTEAM_FIRST_PLAYER_NAME]: [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
  [AWAYTEAM_SECOND_PLAYER_NAME]: [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
  [AWAYTEAM_COLOR]: [MATCH, AWAYTEAM_COLOR],
  [SHOW_COMPONENT]: [MATCH, SHOW_COMPONENT],
  [ADD_AWAYTEAM_COMPONENT]: [MATCH, ADD_AWAYTEAM_COMPONENT],
  [ADD_HOMETEAM_COMPONENT]: [MATCH, ADD_HOMETEAM_COMPONENT],
  [SCOREBOARD_COMPONENT]: [MATCH, SCOREBOARD_COMPONENT]
});
