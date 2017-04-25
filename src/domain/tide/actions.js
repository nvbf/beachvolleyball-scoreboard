import {Map} from 'immutable'
import debug from 'debug'
import {Actions} from 'tide'

import {
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
} from './state';

import {
  getHometeamPointsInCurrentSet,
  getAwayteamPointsInCurrentSet,
  getCurrentSetIndex,
} from './logic';

class AllAction extends Actions {
  mutateAndTrack(key, value) {
      this.mutate(key, (original) => original = value);
      this.mutate([MATCH, HISTORY], (history) => {
        return history.push(
            new Action({
            DATE: new Date(),
            ACTION: key,
            VALUE: value,
            MATCHSTATE: this.getMatch()
          }))
      });      
      this.track(key, value)
  }

  track(key, value) {
      this.mutate(ACTION_HISTORY, (history) => {
        return history.push(
          new Action({
            DATE: new Date(),
            ACTION: key,
            VALUE: value,
            MATCHSTATE: this.getMatch()
          }))
      });
      this.mutateSignals()
      const matchId = this.get([MATCH, MATCH_ID]);
      storeToLocalStorage(matchId, key, value);
  }
  
  mutateSignals = () => {
    const state = this.getMatch();
    console.log('STATE:', state); 
    const index = getCurrentSetIndex(state)
    this.mutate([MATCH, HOMETEAM_TIMEOUT_TAKEN], (original => original = state[index][HOMETEAM_TIMEOUT_TAKEN]))
    this.mutate([MATCH, AWAYTEAM_TIMEOUT_TAKEN], (original => original = state[index][AWAYTEAM_TIMEOUT_TAKEN]))
  }

  hometeamTakeTimeout = ()  => {
    const index  = getCurrentSetIndex(this.getMatch())
    this.mutateAndTrack([MATCH, index, HOMETEAM_TIMEOUT_TAKEN], true)
  }

  awayteamTakeTimeout = ()  => {
    const index  = getCurrentSetIndex(this.getMatch())
    this.mutateAndTrack([MATCH, index, AWAYTEAM_TIMEOUT_TAKEN], true)
  }
  

  addPointHometeam = () => {
    console.log('addPoint home');
    const index  = getCurrentSetIndex(this.getMatch())
    const currentPoints = getHometeamPointsInCurrentSet(this.getMatch());
    this.mutateAndTrack([MATCH, index, HOMETEAM_POINT], currentPoints + 1)
  }

  addPointAwayteam = () => {
    console.log('addPoint away');
    const index  = getCurrentSetIndex(this.getMatch())
    const currentPoints = getAwayteamPointsInCurrentSet(this.getMatch());
    this.mutateAndTrack([MATCH, index, AWAYTEAM_POINT], currentPoints + 1)
  }

  getMatch = () => {
    return this.get(MATCH)
  }

  undo = () => {
    console.log('UNDO')
    const state = new State()
    console.log('------')
    const actions = this.get([MATCH, HISTORY]);
    console.log('actions', actions)
    const lastAction = actions.last()
    const undostate = actions.reduce((agg, curr, index) => {
      // undo the last one.
      if(index === (actions.size - 1)) {
        return agg;
      }
      const key = curr.get(ACTION);
      const value = curr.get(VALUE);
      console.log('key, value', key, value);
      return agg.setIn(key, value)
    }, state)
    
    const undoAction = [UNDO].concat(lastAction.get(ACTION))
    console.log('new state after undo', undostate)
    this.mutate(MATCH, original => original = undostate.get(MATCH));
    this.track(undoAction, lastAction.get(VALUE))
  }
}


function storeToLocalStorage(matchId = 'Match-0', key, value) {
  //console.log(matchId, key, value)
  const historyString = localStorage.getItem(matchId) || [];
  const history = JSON.parse(historyString);
  history.push({'action': key, 'value': value})
  const historyJson = JSON.stringify(history)
  try {
    localStorage.setItem(matchId, historyJson)
  } catch(err) {
    console.error('Error on storing match object', matchID, key, value)
    console.error(err);
  }
}

export default AllAction