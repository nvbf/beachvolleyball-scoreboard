import { List, fromJS } from 'immutable'

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
  ACTION
} from './state'

export function update(matchId = 'Match-0', state) {
  console.log('update', state)
  const lastActionState = state.get(HISTORY).last()
  const lastMatchState = lastActionState.get(MATCHSTATE);

  //simplified to not store to much!
  const stateToStore = state
    .setIn([MATCH], lastMatchState)
    .setIn([HISTORY], new List())

  try {
    localStorage.setItem(matchId, JSON.stringify(stateToStore));
  } catch (err) {
    console.error('Error on storing match object', matchID, key, value)
    console.error(err);
  }
}

export function get(matchId = 'Match-0') {
  const stateString = localStorage.getItem(matchId);
  const state = JSON.parse(stateString);
  console.log('localstorage', state)
  if (state === null) {
    return false;

  }
  const immutablMatch = fromJS(state[MATCH], reciver)

  const actionHistory = state[ACTION_HISTORY].reduce((agg, curr) => {
    return agg.push(new ActionHistory(curr));
  }, new List())

  const immutableState = new State({
    [MATCH]: immutablMatch,
    [HISTORY]: new List(),
    [ACTION_HISTORY]: actionHistory
  })
  return immutableState;
}



/** maps object to records  */
function reciver(key, value) {

  //console.log('key', key)
  const matchKey = new RegExp("^" + key + "$")
  if ("".match(matchKey)) {
    console.log('matched on empty string, default to STATE')
    return new Match(value)
  }
  if (FIRST_SET.match(matchKey)) {
    return new BeachVolleyballSet(value)
  }
  if (SECOND_SET.match(matchKey)) {
    return new BeachVolleyballSet(value)
  }
  if (THIRD_SET.match(matchKey)) {
    return new BeachVolleyballSet(value)
  }

  if (ACTION_HISTORY.match(matchKey)) {
    return new List(value)
  }

  if (HISTORY.match(matchKey)) {
    return new List(value)
  }

  return value

}

