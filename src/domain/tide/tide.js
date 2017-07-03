import { Tide, initActions } from "tide";
import lodash from "lodash";
import State from "./state";
import AllAction from "./actions";

import { constants as c } from "./state";

import {
  getCurrentSetIndex,
  getCurrentSet,
  getHistory,
  calculateNextPersonToServe,
  getFirstTeamToServe,
  getMatch,
  hasHometeamWonSetPure,
  hasAwayteamWonSetPure
} from "./logic";

export default function create() {
  const tide = new Tide();
  tide.setState(new State());
  initActions(tide, { all: AllAction });
  tide.onChange(mutateSignals.bind(tide));

  return tide;
}

const personToServe = state => {
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

  //console.log('person to servce actions:', actions);

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
};

function mutateSignals() {
  const state = this.getState();
  const matchState = this.get(c.MATCH);
  const index = getCurrentSetIndex(matchState);
  const currentSet = getCurrentSet(state);
  const update = mutateIfNotEqual.bind(this);

  update(
    [c.MATCH, c.HOMETEAM_TIMEOUT_TAKEN],
    matchState[index][c.HOMETEAM_TIMEOUT_TAKEN]
  );
  update(
    [c.MATCH, c.AWAYTEAM_TIMEOUT_TAKEN],
    matchState[index][c.AWAYTEAM_TIMEOUT_TAKEN]
  );
  update(
    [c.MATCH, c.SERVICE_ORDER_IS_SET],
    matchState[index][c.SERVICE_ORDER_IS_SET]
  );

  if (currentSet[c.SERVICE_ORDER_IS_SET]) {
    console.log("index", index);
    update([c.MATCH, index, c.PLAYER_TO_SERVE], personToServe(state));
    update([c.MATCH, c.PLAYER_TO_SERVE], personToServe(state));
  }
}

function mutateIfNotEqual(key, value) {
  const current = this.get(key);
  console.log("key, current, value", key, current, value);
  if (
    current == value ||
    (typeof current === "object" && isEquivalent(current, value))
  ) {
    return;
  }
  console.log("diff, lets change it", key, current, value);
  this.mutate(key, original => (original = value));
}

function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}
