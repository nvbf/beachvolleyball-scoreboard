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
  hasAwayteamWonSetPure, personToServe
} from "./logic";

export default function create() {
  const tide = new Tide();
  tide.setState(new State());
  initActions(tide, { all: AllAction });
  tide.onChange(mutateSignals.bind(tide));

  return tide;
}



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
