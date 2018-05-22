//@flow

import moment from "moment";
import printf from "printf";

import {
  FIRST_SET,
  SECOND_SET,
  THIRD_SET,
  AWAYTEAM_POINT,
  HOMETEAM_POINT,
  constants as c,
  AWAYTEAM_FIRST_PLAYER_NAME,
  AWAYTEAM_SECOND_PLAYER_NAME,
  HOMETEAM_SECOND_PLAYER_NAME,
  MATCH_ID
} from "./state";

import type {
  StateType,
  MatchType,
  BeachVolleyballSetType,
  TeamToServeType,
  ServiceOrderType,
  ActionHistoryType
} from "./state";

export function getCurrentSet(state: StateType) {
  const match = state.MATCH;
  const index = getCurrentSetIndex(match);
  return match[index];
}

export function getId(state: MatchType) {
  return state.MATCH_ID;
}

export function getAwayTeamSetsWon(matchState: MatchType) {
  let awayTeamSets = 0;

  if (hasAwayteamWonFirstSet(matchState)) {
    awayTeamSets++;
  }
  if (hasAwayteamWonSecondSet(matchState)) {
    awayTeamSets++;
  }

  if (hasAwayteamWonThirdSet(matchState)) {
    awayTeamSets++;
  }
  return awayTeamSets;
}

// 2 - 1
export function getSetResult(matchState: MatchType) {
  return `${getHomeTeamSetsWon(matchState)} - ${getAwayTeamSetsWon(
    matchState
  )}`;
}

export function getHomeTeamSetsWon(matchState: MatchType) {
  let homeTeamSets = 0;
  if (hasHometeamWonFirstSet(matchState)) {
    homeTeamSets++;
  }
  if (hasHometeamWonSecondSet(matchState)) {
    homeTeamSets++;
  }
  if (hasHometeamWonThirdSet(matchState)) {
    homeTeamSets++;
  }
  return homeTeamSets;
}

// 19-21, 21-19, 15-13
export function getResult(matchState: MatchType) {
  const s1 = getScoreFromFirstSet(matchState);
  const s2 = getScoreFromSecondSet(matchState);
  const s3 = getScoreFromThirdSet(matchState);
  return `${s1}, ${s2}, ${s3}`;
}

export function getScoreFromFirstSet(matchState: MatchType) {
  const h = getHomeTeamPointInFirstSet(matchState);
  const b = getAwayTeamPointInFirstSet(matchState);
  return `${h} - ${b}`;
}

export function getScoreFromSecondSet(matchState: MatchType) {
  const h = getHomeTeamPointInSecondSet(matchState);
  const b = getAwayTeamPointInSecondSet(matchState);
  return `${h} - ${b}`;
}

export function getScoreFromThirdSet(matchState: MatchType) {
  const h = getHomeTeamPointInThirdSet(matchState);
  const b = getAwayTeamPointInThirdSet(matchState);
  return `${h} - ${b}`;
}

const constantToText = {
  [c.AWAYTEAM_COLOR]: "Away team has color %s",
  [c.HOMETEAM_COLOR]: "Home team has color %s",
  [c.AWAYTEAM_FIRST_PLAYER_NAME]:
    "Name set to %s for Player 1 on the away team",
  [c.AWAYTEAM_SECOND_PLAYER_NAME]:
    "Name set to %s for Player 2 on the away team",
  [c.HOMETEAM_FIRST_PLAYER_NAME]:
    "Name set to %s for Player 2 on the home team",
  [c.HOMETEAM_SECOND_PLAYER_NAME]:
    "Name set to %s for Player 2 on the home team",
  [c.AWAYTEAM_POINT]: "Away team got a point, they have now %s points",
  [c.HOMETEAM_POINT]: "Home team got a point, they have now %s points",
  [c.AWAYTEAM_TIMEOUT_TAKEN]: "Away team is taking a timout",
  [c.HOMETEAM_TIMEOUT_TAKEN]: "Home team is taking a timout",
  [c.COMMENTS]: "Comment: %s"
};

export function getDetailsAsAnArrayOfString(
  details: Array<ActionHistoryType> = []
): Array<string> {
  console.log("getDetailsAsAnArrayOfString", details);
  const detailsString = details.map(actionHistory => {
    const actions = actionHistory.ACTION;
    const lastKey = getKey(actions);
    const isUndo = actions[0] === c.UNDO;
    const tekstString = constantToText[lastKey];
    const value = actionHistory.VALUE;
    const date = actionHistory.DATE;
    const relativeTime = moment(date).format("HH:mm:ss");
    const undoInfo = isUndo ? "UNDO:" : "";
    const homeScore = actionHistory.HOMETEAM_POINT;
    const awayScore = actionHistory.AWAYTEAM_POINT;
    if (tekstString === undefined) {
      //console.log('Skipping', lastKey)
      return "";
    }
    return printf(
      `${undoInfo} ${relativeTime}, ${homeScore}-${awayScore}, ${tekstString}`,
      value
    );
  });
  return detailsString;
}

function getKey(actions) {
  return Array.isArray(actions) ? actions[actions.length - 1] : actions;
}

export function getFirstSet(match: MatchType) {
  return match[c.FIRST_SET];
}

export function getSecondSet(match: MatchType) {
  return match[c.SECOND_SET];
}

export function getThirdSet(match: MatchType) {
  return match[c.THIRD_SET];
}

export function getHomeTeamPointFromSet(setState: BeachVolleyballSetType) {
  return setState["HOMETEAM_POINT"];
}

export function getAwayTeamPointFromSet(setState: BeachVolleyballSetType) {
  return setState["AWAYTEAM_POINT"];
}

export function getHomeTeamPointInFirstSet(matchState: MatchType) {
  return getHomeTeamPointFromSet(getFirstSet(matchState));
}

export function getHomeTeamPointInSecondSet(matchState: MatchType) {
  return getHomeTeamPointFromSet(getSecondSet(matchState));
}

export function getHomeTeamPointInThirdSet(matchState: MatchType) {
  return getHomeTeamPointFromSet(getThirdSet(matchState));
}

export function getAwayTeamPointInFirstSet(matchState: MatchType) {
  return getAwayTeamPointFromSet(getFirstSet(matchState));
}

export function getAwayTeamPointInSecondSet(matchState: MatchType) {
  return getAwayTeamPointFromSet(getSecondSet(matchState));
}
export function getAwayTeamPointInThirdSet(matchState: MatchType) {
  return getAwayTeamPointFromSet(getThirdSet(matchState));
}

export function getHistory(state: StateType) {
  return state.HISTORY;
}

export function getMatch(state: StateType) {
  return state[c.MATCH];
}

export function getFirstTeamToServe(currentSet: BeachVolleyballSetType) {
  return currentSet[c.FIRST_TEAM_TO_SERVE];
}

export function getTeamVsString(match: MatchType) {
  return `${getHomeTeamString(match)} - ${getAwayTeamString(match)}`;
}

export function getAwayTeamString(state: MatchType) {
  const bFirstPlayer = state[c.AWAYTEAM_FIRST_PLAYER_NAME];
  const bSecondPlayer = state[c.AWAYTEAM_SECOND_PLAYER_NAME];

  return `${bFirstPlayer} / ${bSecondPlayer}`;
}

export function getHomeTeamString(state: MatchType) {
  const aFirstPlayer = state["HOMETEAM_FIRST_PLAYER_NAME"];
  const aSecondPlayer = state["HOMETEAM_SECOND_PLAYER_NAME"];

  return `${aFirstPlayer} / ${aSecondPlayer}`;
}

export function calculateNextPersonToServe(
  firstTeamToServe: TeamToServeType,
  serviceOrderHomeTeam: ServiceOrderType,
  serviceOrderAwayTeam: ServiceOrderType,
  number: number
) {
  // Resultat mellom 0 og 4.
  const server = number % 4;

  if (server === 0) {
    return getFirstPlayerToServe(
      firstTeamToServe,
      serviceOrderHomeTeam,
      serviceOrderAwayTeam
    );
  } else if (server === 1) {
    return getSecondPlayerToServe(
      firstTeamToServe,
      serviceOrderHomeTeam,
      serviceOrderAwayTeam
    );
  } else if (server === 2) {
    return getThirdPlayerToServe(
      firstTeamToServe,
      serviceOrderHomeTeam,
      serviceOrderAwayTeam
    );
  } else if (server === 3) {
    return getFourthPlayerToServe(
      firstTeamToServe,
      serviceOrderHomeTeam,
      serviceOrderAwayTeam
    );
  }
}

function getFirstPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderHomeTeam[0];
  }
  return serviceOrderAwayTeam[0];
}

function getSecondPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderAwayTeam[0];
  }
  return serviceOrderHomeTeam[0];
}

function getThirdPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderHomeTeam[1];
  }
  return serviceOrderAwayTeam[1];
}

function getFourthPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderAwayTeam[1];
  }
  return serviceOrderHomeTeam[1];
}

export function getFirstPersonToServe(state: StateType) {
  const currentSet = getCurrentSet(state);
  const firstTeamToServe = getFirstTeamToServe(currentSet);
  return firstTeamToServe === c.HOMETEAM
    ? currentSet["SERVICE_ORDER_HOMETEAM"][0]
    : currentSet["SERVICE_ORDER_AWAYTEAM"][0];
}

export function getCurrentSetIndex(match: MatchType) {
  if (!isFirstSetFinished(match)) {
    return FIRST_SET;
  }
  if (!isSecondSetFinished(match)) {
    return SECOND_SET;
  }
  if (!isThirdSetFinished(match)) {
    return THIRD_SET;
  }
  console.log("Is game finished? returning third set");
  return THIRD_SET;
}

export function getPointsInCurrentSet(match: MatchType) {
  return [
    getHometeamPointsInCurrentSet(match),
    getAwayteamPointsInCurrentSet(match)
  ];
}

export function getScoreForCompletedSets(match: MatchType) {
  let completedSets = [];
  if (isFirstSetFinished(match)) {
    completedSets.push(getScoreFromFirstSet(match));
  }
  if (isSecondSetFinished(match)) {
    completedSets.push(getScoreFromSecondSet(match));
  }
  if (isThirdSetFinished(match)) {
    completedSets.push(getScoreFromThirdSet(match));
  }
  return completedSets.join(", ");
}

export function getPointsInCurrentSetAsString(match: MatchType) {
  const points = getPointsInCurrentSet(match);
  return `${points[0]} - ${points[1]}`;
}

export function getHometeamPointsInCurrentSet(score: MatchType) {
  const index = getCurrentSetIndex(score);
  return score[index][HOMETEAM_POINT];
}

export function getAwayteamPointsInCurrentSet(score: MatchType) {
  const index = getCurrentSetIndex(score);
  return score[index][AWAYTEAM_POINT];
}

export function getSetIndexToRemovePointFrom(score: MatchType) {
  if (isThirdSetStarted(score)) {
    return THIRD_SET;
  }
  if (isSecondSetStarted(score)) {
    return SECOND_SET;
  }
  return FIRST_SET;
}

export function isFirstSetFinished(score: MatchType) {
  return isSetFinished(score.FIRST_SET, 21);
}

export function isSecondSetFinished(score: MatchType) {
  return isSetFinished(score.SECOND_SET, 21);
}

export function isThirdSetFinished(score: MatchType) {
  return isSetFinished(score.THIRD_SET, 15);
}

export function isFirstSetStarted(score: MatchType) {
  return isSetStarted(score.FIRST_SET);
}

export function isSecondSetStarted(score: MatchType) {
  return isSetStarted(score.SECOND_SET);
}

export function isThirdSetStarted(score: MatchType) {
  return isSetStarted(score.THIRD_SET);
}

export function isSetStarted(aSet: BeachVolleyballSetType) {
  return aSet.HOMETEAM_POINT !== 0 && aSet.AWAYTEAM_POINT !== 0;
}

export function isSetFinished(aSet: BeachVolleyballSetType, limit: number) {
  console.log(hasHometeamWonSet(aSet, limit));
  console.log(hasAwayteamWonSet(aSet, limit));
  return hasHometeamWonSet(aSet, limit) || hasAwayteamWonSet(aSet, limit);
}

export function isMatchFinished(matchState: MatchType) {
  return hasAwayTeamWonMatch(matchState) || hasHomeTeamWonMatch(matchState);
}

export function hasAwayTeamWonMatch(matchState: MatchType) {
  return (
    hasAwayteamWonThirdSet(matchState) ||
    (hasAwayteamWonFirstSet(matchState) && hasAwayteamWonSecondSet(matchState))
  );
}

export function getWinnerAsString(match: MatchType) {
  return hasHomeTeamWonMatch(match)
    ? getHomeTeamString(match)
    : getAwayTeamString(match);
}

export function hasHomeTeamWonMatch(score: MatchType) {
  return (
    hasHometeamWonThirdSet(score) ||
    (hasHometeamWonFirstSet(score) && hasHometeamWonSecondSet(score))
  );
}

function hasHometeamWonFirstSet(score: MatchType) {
  return hasHometeamWonSet(score.FIRST_SET, 21);
}

function hasHometeamWonSecondSet(score: MatchType) {
  return hasHometeamWonSet(score.SECOND_SET, 21);
}

function hasHometeamWonThirdSet(score: MatchType) {
  return hasHometeamWonSet(score.THIRD_SET, 15);
}

function hasAwayteamWonFirstSet(score: MatchType) {
  return hasAwayteamWonSet(score.FIRST_SET, 21);
}

function hasAwayteamWonSecondSet(score: MatchType) {
  return hasAwayteamWonSet(score.SECOND_SET, 21);
}

function hasAwayteamWonThirdSet(score: MatchType) {
  return hasAwayteamWonSet(score.THIRD_SET, 15);
}

export function hasHometeamWonSetPure(
  hometeamPoints: number,
  awayteamPoints: number,
  limit: number
) {
  const hometeamHas21orMorePoints = hometeamPoints >= limit;
  const hometeamHas2orMorePointThenAwayteam =
    hometeamPoints > awayteamPoints + 1;
  return hometeamHas21orMorePoints && hometeamHas2orMorePointThenAwayteam;
}

export function hasAwayteamWonSetPure(
  hometeamPoints: number,
  awayteamPoints: number,
  limit: number
) {
  const awayteamHas21orMorePoints = awayteamPoints >= limit;
  const awayteamHas2orMorePointThenHometeam =
    awayteamPoints > hometeamPoints + 1;
  return awayteamHas21orMorePoints && awayteamHas2orMorePointThenHometeam;
}

function hasAwayteamWonSet(aSet: BeachVolleyballSetType, limit) {
  const point1 = aSet.HOMETEAM_POINT;
  const point2 = aSet.AWAYTEAM_POINT;
  return hasAwayteamWonSetPure(point1, point2, limit);
}

function hasHometeamWonSet(aSet: BeachVolleyballSetType, limit) {
  const point1 = aSet.HOMETEAM_POINT;
  const point2 = aSet.AWAYTEAM_POINT;
  return hasHometeamWonSetPure(point1, point2, limit);
}
