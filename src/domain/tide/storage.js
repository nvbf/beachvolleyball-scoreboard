import { List, fromJS } from "immutable";
import { save } from "../../firebase";

import {
  ACTION_HISTORY,
  MATCH,
  State,
  HISTORY,
  MATCHSTATE,
  Action,
  Match,
  BeachVolleyballSet,
  FIRST_SET,
  SECOND_SET,
  ActionHistory,
  THIRD_SET,
  ACTION,
  constants as c
} from "./state";

export function update(matchId, state) {
  console.log("update", state);
  const lastActionState = state.get(HISTORY).last();
  const lastMatchState = lastActionState.get(MATCHSTATE);
  console.log("matchId", matchId);

  const tournamentId = state[c.MATCH][c.TOURNAMENT_PRIVATE_ID] || 0;

  // Simplified to not store to much!
  const stateToStore = state
    .setIn([MATCH], lastMatchState)
    .setIn([HISTORY], List());

  // If its'a tournament, we need the complete history to calculate serving team:
  const completeState = tournamentId ? state : null
  try {
    save(tournamentId, matchId, {
      match: stateToStore,
      tournamentId: tournamentId,
    }, completeState);
  } catch (err) {
    console.error("Error on storing match object, firebase", matchId);
    console.error(err);
  }

  try {
    localStorage.setItem(matchId, JSON.stringify(stateToStore));
    // database
  } catch (err) {
    console.error("Error on storing match object, localStorage");
    console.error(err);
  }
}

export function get(matchId = "Match-0") {
  const stateString = localStorage.getItem(matchId);
  const state = JSON.parse(stateString);
  console.log("localstorage", state);
  if (state === null) {
    return false;
  }
  return transformToCorrectState(state);
}

export function transformToCorrectState(state) {
  const immutablMatch = fromJS(state[MATCH], reciver);

  const actionHistory = state[ACTION_HISTORY].reduce((agg, curr) => {
    return agg.push(new ActionHistory(curr));
  }, List());

  const immutableState = new State({
    [MATCH]: immutablMatch,
    [HISTORY]: List(),
    [ACTION_HISTORY]: actionHistory
  });
  return immutableState;
}

/** Maps object to records  */
function reciver(key, value) {
  // Console.log('key', key)
  const matchKey = new RegExp("^" + key + "$");
  if ("".match(matchKey)) {
    console.log("matched on empty string, default to STATE");
    return new Match(value);
  }
  if (FIRST_SET.match(matchKey)) {
    return new BeachVolleyballSet(value);
  }
  if (SECOND_SET.match(matchKey)) {
    return new BeachVolleyballSet(value);
  }
  if (THIRD_SET.match(matchKey)) {
    return new BeachVolleyballSet(value);
  }

  if (ACTION_HISTORY.match(matchKey)) {
    return List(value);
  }

  if (HISTORY.match(matchKey)) {
    return List(value);
  }

  return value;
}
