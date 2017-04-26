import {List} from 'immutable'

import {
  ACTION_HISTORY,
  MATCH,
  State,
  HISTORY,
  MATCHSTATE,
  Action
} from './state'

export function update(matchId = 'Match-0', action) {
  const historyString = localStorage.getItem(matchId) || '[]';
  const history = JSON.parse(historyString);
  history.push(action.toJS())
  const historyJson = JSON.stringify(history)
  try {
    localStorage.setItem(matchId, historyJson)
  } catch(err) {
    console.error('Error on storing match object', matchID, key, value)
    console.error(err);
  }
}

export function get(matchId = 'Match-0') {
  const actionHistoryString = localStorage.getItem(matchId)
  if(actionHistoryString === null) {
      return false;
  }
  const actionHistory = JSON.parse(actionHistoryString);
  const actionHistoryList = actionHistory.reduce ((list, action) => {
    return list.push(new Action(action));
  }, List())
  const state = new State({
    [ACTION_HISTORY]:  actionHistoryList,
    [HISTORY]: actionHistoryList[MATCHSTATE],
    [MATCHSTATE]:  actionHistoryList[MATCHSTATE]
  });
  return state;
}
