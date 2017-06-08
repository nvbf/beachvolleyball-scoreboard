import List from "immutable";
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

export function getCurrentSet(state) {
  const match = state[c.MATCH];
  const index = getCurrentSetIndex(match);
  return match[index];
}

export function getId(state) {
  return state[c.MATCH_ID];
}

// 2 - 1
export function getSetResult(matchState) {
  let homeTeamSets = 0;
  let awayTeamSets = 0;
  if (hasHometeamWonFirstSet(matchState)) {
    homeTeamSets++;
  }
  if (hasAwayteamWonFirstSet(matchState)) {
    awayTeamSets++;
  }
  if (hasHometeamWonSecondSet(matchState)) {
    homeTeamSets++;
  }
  if (hasAwayteamWonSecondSet(matchState)) {
    awayTeamSets++;
  }
  if (hasHometeamWonThirdSet(matchState)) {
    homeTeamSets++;
  }
  if (hasAwayteamWonThirdSet(matchState)) {
    awayTeamSets++;
  }

  return `${homeTeamSets} - ${awayTeamSets}`;
}

// 19-21, 21-19, 15-13
export function getResult(matchState) {
  const h1p = getHomeTeamPointInFirstSet(matchState);
  const h2p = getHomeTeamPointInSecondSet(matchState);
  const h3p = getHomeTeamPointInThirdSet(matchState);
  const b1p = getAwayTeamPointInFirstSet(matchState);
  const b2p = getAwayTeamPointInSecondSet(matchState);
  const b3p = getAwayTeamPointInThirdSet(matchState);
  return `${h1p} - ${b1p}, ${h2p} - ${b2p}, ${h3p} - ${h3p}`;
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

export function getDetailsAsAnArrayOfString(details = []) {
  console.log("getDetailsAsAnArrayOfString", details);
  const detailsString = details.map((actionHistory, index) => {
    const actions = actionHistory.get(c.ACTION);
    const lastKey = getKey(actions);
    const isUndo = actions[0] === c.UNDO;
    const tekstString = constantToText[lastKey];
    const value = actionHistory.get(c.VALUE);
    const date = actionHistory.get(c.DATE);
    const relativeTime = moment(date).format("HH:mm:ss");
    const undoInfo = isUndo ? "UNDO:" : "";
    const homeScore = actionHistory.get(c.HOMETEAM_POINT);
    const awayScore = actionHistory.get(c.AWAYTEAM_POINT);
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
  if (List.is(actions)) {
    return actions.list();
  }
  return Array.isArray(actions) ? actions[actions.length - 1] : actions;
}

export function getFirstSet(match) {
  return match[c.FIRST_SET];
}

export function getSecondSet(match) {
  return match[c.SECOND_SET];
}

export function getThirdSet(match) {
  return match[c.THIRD_SET];
}

export function getHomeTeamPointFromSet(setState) {
  return setState[c.HOMETEAM_POINT];
}

export function getAwayTeamPointFromSet(setState) {
  return setState[c.AWAYTEAM_POINT];
}

export function getHomeTeamPointInFirstSet(matchState) {
  return getHomeTeamPointFromSet(getFirstSet(matchState));
}

export function getHomeTeamPointInSecondSet(matchState) {
  return getHomeTeamPointFromSet(getSecondSet(matchState));
}

export function getHomeTeamPointInThirdSet(matchState) {
  return getHomeTeamPointFromSet(getThirdSet(matchState));
}

export function getAwayTeamPointInFirstSet(matchState) {
  return getAwayTeamPointFromSet(getFirstSet(matchState));
}

export function getAwayTeamPointInSecondSet(matchState) {
  return getAwayTeamPointFromSet(getSecondSet(matchState));
}
export function getAwayTeamPointInThirdSet(matchState) {
  return getAwayTeamPointFromSet(getThirdSet(matchState));
}

export function getHistory(state) {
  return state.HISTORY;
}

export function getMatch(state) {
  return state[c.MATCH];
}

export function getFirstTeamToServe(currentSet) {
  return currentSet[c.FIRST_TEAM_TO_SERVE];
}

export function getTeamVsString(state) {
  return `${getHomeTeamString(state)} - ${getAwayTeamString(state)}`;
}

export function getAwayTeamString(state) {
  const bFirstPlayer = state[c.AWAYTEAM_FIRST_PLAYER_NAME];
  const bSecondPlayer = state[c.AWAYTEAM_SECOND_PLAYER_NAME];

  return `${bFirstPlayer} / ${bSecondPlayer}`;
}

export function getHomeTeamString(state) {
  const aFirstPlayer = state[c.HOMETEAM_FIRST_PLAYER_NAME];
  const aSecondPlayer = state[c.HOMETEAM_SECOND_PLAYER_NAME];

  return `${aFirstPlayer} / ${aSecondPlayer}`;
}

export function calculateNextPersonToServe(
  firstTeamToServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam,
  number
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
    return serviceOrderHomeTeam.first();
  }
  return serviceOrderAwayTeam.first();
}

function getSecondPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderAwayTeam.first();
  }
  return serviceOrderHomeTeam.first();
}

function getThirdPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderHomeTeam.last();
  }
  return serviceOrderAwayTeam.last();
}

function getFourthPlayerToServe(
  firstTeamtoServe,
  serviceOrderHomeTeam,
  serviceOrderAwayTeam
) {
  if (firstTeamtoServe === c.HOMETEAM) {
    return serviceOrderAwayTeam.last();
  }
  return serviceOrderHomeTeam.last();
}

export function getFirstePersonToServe(state) {
  const currentSet = getCurrentSet(state);
  const firstTeamToServe = getFirstTeamToServe(currentSet);
  return firstTeamToServe === c.HOMETEAM
    ? currentSet[c.SERVICE_ORDER_HOMETEAM].first()
    : currentSet[c.SERVICE_ORDER_AWAYTEAMM].first();
}

export function getCurrentSetIndex(match) {
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

export function getHometeamPointsInCurrentSet(score) {
  const index = getCurrentSetIndex(score);
  return score[index][HOMETEAM_POINT];
}

export function getAwayteamPointsInCurrentSet(score) {
  const index = getCurrentSetIndex(score);
  return score[index][AWAYTEAM_POINT];
}

export function getSetIndexToRemovePointFrom(score) {
  if (isThirdSetStarted(score)) {
    return THIRD_SET;
  }
  if (isSecondSetStarted(score)) {
    return SECOND_SET;
  }
  return FIRST_SET;
}

export function isFirstSetFinished(score) {
  return isSetFinished(score.get(FIRST_SET), 21);
}

export function isSecondSetFinished(score) {
  return isSetFinished(score.get(SECOND_SET), 21);
}

export function isThirdSetFinished(score) {
  return isSetFinished(score.get(THIRD_SET), 15);
}

export function isFirstSetStarted(score) {
  return isSetStarted(score.get(FIRST_SET));
}

export function isSecondSetStarted(score) {
  return isSetStarted(score.get(SECOND_SET));
}

export function isThirdSetStarted(score) {
  return isSetStarted(score.get(THIRD_SET));
}

export function isSetStarted(aSet) {
  return aSet.get(HOMETEAM_POINT) !== 0 && aSet.get(AWAYTEAM_POINT) !== 0;
}

export function isSetFinished(aSet, limit) {
  return hasHometeamWonSet(aSet, limit) || hasAwayteamWonSet(aSet, limit);
}

export function isMatchFinished(matchState) {
  return hasAwayTeamWonMatch(matchState) || hasHomeTeamWonMatch(matchState);
}

export function hasAwayTeamWonMatch(matchState) {
  return (
    hasAwayteamWonThirdSet(matchState) ||
    (hasAwayteamWonFirstSet(matchState) && hasAwayteamWonSecondSet(matchState))
  );
}

export function getWinnerAsString(match) {
  return hasHomeTeamWonMatch(match)
    ? getHomeTeamString(match)
    : getAwayTeamString(match);
}

export function hasHomeTeamWonMatch(score) {
  return (
    hasHometeamWonThirdSet(score) ||
    (hasHometeamWonFirstSet(score) && hasHometeamWonSecondSet(score))
  );
}

function hasHometeamWonFirstSet(score) {
  return hasHometeamWonSet(score.get(FIRST_SET), 21);
}

function hasHometeamWonSecondSet(score) {
  return hasHometeamWonSet(score.get(SECOND_SET), 21);
}

function hasHometeamWonThirdSet(score) {
  return hasHometeamWonSet(score.get(THIRD_SET), 15);
}

function hasAwayteamWonFirstSet(score) {
  return hasAwayteamWonSet(score.get(FIRST_SET), 21);
}

function hasAwayteamWonSecondSet(score) {
  return hasAwayteamWonSet(score.get(SECOND_SET), 21);
}

function hasAwayteamWonThirdSet(score) {
  return hasAwayteamWonSet(score.get(THIRD_SET), 15);
}

function hasAwayteamWonSet(aSet, limit) {
  const point1 = aSet.get(HOMETEAM_POINT);
  const point2 = aSet.get(AWAYTEAM_POINT);
  const awayteamHas21orMorePoints = point2 >= limit;
  const awayteamHas2orMorePointThenHometeam = point2 > point1 + 1;
  return awayteamHas21orMorePoints && awayteamHas2orMorePointThenHometeam;
}

function hasHometeamWonSet(aSet, limit) {
  const point1 = aSet.get(HOMETEAM_POINT);
  const point2 = aSet.get(AWAYTEAM_POINT);
  const hometeamHas21orMorePoints = point1 >= limit;
  const hometeamHas2orMorePointThenAwayteam = point1 > point2 + 1;
  //console.log('p1, p2, limit, ,', point1, point2, limit, hometeamHas21orMorePoints, hometeamHas2orMorePointThenAwayteam)
  return hometeamHas21orMorePoints && hometeamHas2orMorePointThenAwayteam;
}
