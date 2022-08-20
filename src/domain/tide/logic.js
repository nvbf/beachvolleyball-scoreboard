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
export function getAwayTeamSetsWon(matchState) {
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

export function getSetResult(matchState) {
  return `${getHomeTeamSetsWon(matchState)} - ${getAwayTeamSetsWon(
    matchState
  )}`;
}

export function getHomeTeamSetsWon(matchState) {
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
export function getResult(matchState) {
  const s1 = getScoreFromFirstSet(matchState);
  const s2 = getScoreFromSecondSet(matchState);
  const s3 = getScoreFromThirdSet(matchState);
  return `${s1}, ${s2}, ${s3}`;
}

export function getScoreFromFirstSet(matchState, asArray) {
  const h = getHomeTeamPointInFirstSet(matchState);
  const b = getAwayTeamPointInFirstSet(matchState);
  if (asArray) {
    return [h, b];
  }
  return `${h} - ${b}`;
}

export function getScoreFromSecondSet(matchState, asArray) {
  const h = getHomeTeamPointInSecondSet(matchState);
  const b = getAwayTeamPointInSecondSet(matchState);
  if (asArray) {
    return [h, b];
  }
  return `${h} - ${b}`;
}

export function getScoreFromThirdSet(matchState, asArray) {
  const h = getHomeTeamPointInThirdSet(matchState);
  const b = getAwayTeamPointInThirdSet(matchState);
  if (asArray) {
    return [h, b];
  }
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

export function getDetailsAsAnArrayOfString(details = []) {
  console.log("getDetailsAsAnArrayOfString", details);
  const detailsString = getDetailsAsAnArray(details)
    .map((action, index) => {
      const {isUndo, homeScore, awayScore, timestamp, value} = action;
      const relativeTime = moment(timestamp).format("HH:mm:ss");
      const undoInfo = isUndo ? "UNDO:" : "";
      return printf(
        `${undoInfo} ${relativeTime}, ${homeScore}-${awayScore}, ${tekstString}`,
        value
      );
    });
  return detailsString;
}

export function getDetailsAsAnArray(details = []) {
  console.log("getDetailsAsAnArrayOfString", details);
  const detailsString = details.reduce((allDetails, actionHistory, index) => {
    const actions = actionHistory.get(c.ACTION);
    const lastKey = getKey(actions);
    const isUndo = actions[0] === c.UNDO;
    const tekstString = constantToText[lastKey];
    const value = actionHistory.get(c.VALUE);
    const date = actionHistory.get(c.DATE);
    const homeScore = actionHistory.get(c.HOMETEAM_POINT);
    const awayScore = actionHistory.get(c.AWAYTEAM_POINT);
    if (tekstString === undefined) {
      return allDetails;
    }
    allDetails.push({
      timestamp: date,
      textString: tekstString,
      homeScore,
      awayScore,
      isUndo,
      value
    });
    return allDetails;
  }, []);
  console.log('Details string', detailsString);
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

export function personToServe (state) {
  console.log('Person to serve', state);
  const currentSet = getCurrentSet(state);
  const index = getCurrentSetIndex(getMatch(state));
  console.log("CURRENT SET index:", index);
  const firstTeamToServe = getFirstTeamToServe(currentSet);
  console.log("firstTeamToServe", firstTeamToServe);
  const serviceOrderHomeTeam = currentSet[c.SERVICE_ORDER_HOMETEAM];
  console.log("serviceOrderHomeTeam", currentSet[c.SERVICE_ORDER_HOMETEAM]);
  const serviceOrderAwayTeam = currentSet[c.SERVICE_ORDER_AWAYTEAM];
  console.log("serviceOrderAwayTeam", currentSet[c.SERVICE_ORDER_AWAYTEAM]);
  const actions = getHistory(state);

  console.log('person to servce actions:', actions);

  const personToServeI = actions
    .filter(action => {
      if (
        action &&
        action[c.ACTION] &&
        action[c.ACTION] &&
        action[c.ACTION].length > 2
      ) {
        const actionHistoryAction = action[c.ACTION][2];
        console.log("actionHistoryState", actionHistoryAction);
        return (
          actionHistoryAction === c.HOMETEAM_POINT ||
          actionHistoryAction === c.AWAYTEAM_POINT
        );
      }
      return false;
    })
    .map(action => action[c.ACTION][2])
    .reduce(
      (agg, action) => {
        // console.log("action loop");
        if (action === c.HOMETEAM_POINT) {
          agg.hometeamPoints++;
          if (
            hasHometeamWonSetPure(agg.hometeamPoints, agg.awayteamPoints, 21)
          ) {
            // console.log("Hometeam finished with the set");
            agg.serving = firstTeamToServe;
            agg.number = 0;
            agg.hometeamPoints = 0;
            agg.awayteamPoints = 0;
            agg.name = calculateNextPersonToServe(
              firstTeamToServe,
              serviceOrderHomeTeam,
              serviceOrderAwayTeam,
              0
            );
            return agg;
          }
        }

        if (action === c.AWAYTEAM_POINT) {
          agg.awayteamPoints++;
          if (
            hasAwayteamWonSetPure(agg.hometeamPoints, agg.awayteamPoints, 21)
          ) {
            // console.log("Awayteam finished with the set");
            agg.serving = firstTeamToServe;
            agg.number = 0;
            agg.hometeamPoints = 0;
            agg.awayteamPoints = 0;
            agg.name = calculateNextPersonToServe(
              firstTeamToServe,
              serviceOrderHomeTeam,
              serviceOrderAwayTeam,
              0
            );
            return agg;
          }
        }

        if (
          (action === c.HOMETEAM_POINT && agg.serving === c.HOMETEAM) ||
          (action === c.AWAYTEAM_POINT && agg.serving === c.AWAYTEAM)
        ) {
          // console.log("Same server!!!");
          return agg;
        }

        const newNumber = agg.number + 1;
        // console.log("next server", newNumber);
        const serving = agg.serving === c.HOMETEAM ? c.AWAYTEAM : c.HOMETEAM;
        return {
          hometeamPoints: agg.hometeamPoints,
          awayteamPoints: agg.awayteamPoints,
          serving,
          name: calculateNextPersonToServe(
            firstTeamToServe,
            serviceOrderHomeTeam,
            serviceOrderAwayTeam,
            newNumber
          ),
          number: newNumber
        };
      },
      {
        serving: firstTeamToServe,
        name: calculateNextPersonToServe(
          firstTeamToServe,
          serviceOrderHomeTeam,
          serviceOrderAwayTeam,
          0
        ),
        hometeamPoints: 0,
        awayteamPoints: 0,
        number: 0
      }
    );
  return { name: personToServeI.name, team: personToServeI.serving };
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

export function getPointsInCurrentSet(match) {
  return [
    getHometeamPointsInCurrentSet(match),
    getAwayteamPointsInCurrentSet(match)
  ];
}

export function getScoreForCompletedSets(match) {
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

export function getScoreForCompletedSetsAsArray(match) {
  let completedSets = [];
  if (isFirstSetFinished(match)) {
    completedSets.push(getScoreFromFirstSet(match, true));
  }
  if (isSecondSetFinished(match)) {
    completedSets.push(getScoreFromSecondSet(match, true));
  }
  if (isThirdSetFinished(match)) {
    completedSets.push(getScoreFromThirdSet(match, true));
  }
  return completedSets;
}

export function getPointsInCurrentSetAsString(match) {
  const points = getPointsInCurrentSet(match);
  return `${points[0]} - ${points[1]}`;
}

export function getHometeamPointsInCurrentSet(score) {
  const index = getCurrentSetIndex(score);
  return score[index][HOMETEAM_POINT];
}

export function getTimeoutTakenInCurrentSet(team, match) {
  const index = getCurrentSetIndex(match);
  return team == c.HOMETEAM ? match[index][c.HOMETEAM_TIMEOUT_TAKEN] : match[index][c.AWAYTEAM_TIMEOUT_TAKEN];
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
  console.log('The score is', score);
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

export function hasHometeamWonSetPure(hometeamPoints, awayteamPoints, limit) {
  const hometeamHas21orMorePoints = hometeamPoints >= limit;
  const hometeamHas2orMorePointThenAwayteam =
    hometeamPoints > awayteamPoints + 1;
  //console.log('p1, p2, limit, ,', point1, point2, limit, hometeamHas21orMorePoints, hometeamHas2orMorePointThenAwayteam)
  return hometeamHas21orMorePoints && hometeamHas2orMorePointThenAwayteam;
}

export function hasAwayteamWonSetPure(hometeamPoints, awayteamPoints, limit) {
  const awayteamHas21orMorePoints = awayteamPoints >= limit;
  const awayteamHas2orMorePointThenHometeam =
    awayteamPoints > hometeamPoints + 1;
  return awayteamHas21orMorePoints && awayteamHas2orMorePointThenHometeam;
}

function hasAwayteamWonSet(aSet, limit) {
  const point1 = aSet.get(HOMETEAM_POINT);
  const point2 = aSet.get(AWAYTEAM_POINT);
  return hasAwayteamWonSetPure(point1, point2, limit);
}

function hasHometeamWonSet(aSet, limit) {
  const point1 = aSet.get(HOMETEAM_POINT);
  const point2 = aSet.get(AWAYTEAM_POINT);
  return hasHometeamWonSetPure(point1, point2, limit);
}
