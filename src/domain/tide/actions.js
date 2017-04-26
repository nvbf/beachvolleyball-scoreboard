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
  update as storeToLocalStorage 
} from './storage';

import {
  getHometeamPointsInCurrentSet,
  getAwayteamPointsInCurrentSet,
  getCurrentSetIndex,
} from './logic';

class AllAction extends Actions {
  mutateAndTrack(key, value) {
      this.mutate(key, (original) => original = value);
      this.mutate(HISTORY, (history) => {
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
      const action = new Action({
        DATE: new Date(),
        ACTION: key,
        VALUE: value,
        MATCHSTATE: this.getMatch()
      })
      this.mutate(ACTION_HISTORY, (history) => history.push(action))
      this.mutateSignals()
      const matchId = this.get([MATCH, MATCH_ID]);
      storeToLocalStorage(matchId, action);
  }
  
  mutateSignals = () => {
    const state = this.getMatch();
    const index = getCurrentSetIndex(state)
    this.mutate([MATCH, HOMETEAM_TIMEOUT_TAKEN], (original => original = state[index][HOMETEAM_TIMEOUT_TAKEN]))
    this.mutate([MATCH, AWAYTEAM_TIMEOUT_TAKEN], (original => original = state[index][AWAYTEAM_TIMEOUT_TAKEN]))
  }

  hometeamTakeTimeout = (proxy, event, state = this.getMatch()) => {
    const index  = getCurrentSetIndex(state)
    this.mutateAndTrack([MATCH, index, HOMETEAM_TIMEOUT_TAKEN], true)
  }

  awayteamTakeTimeout = (proxy, event, state = this.getMatch()) => {
    const index  = getCurrentSetIndex(state)
    this.mutateAndTrack([MATCH, index, AWAYTEAM_TIMEOUT_TAKEN], true)
  }
  

  addPointHometeam = (proxy, event, state = this.getMatch()) => {
    const index  = getCurrentSetIndex(state)
    const currentPoints = getHometeamPointsInCurrentSet(state);
    this.mutateAndTrack([MATCH, index, HOMETEAM_POINT], currentPoints + 1)
  }

  addPointAwayteam = (proxy, event, state = this.getMatch()) => {
    const index  = getCurrentSetIndex(state)
    const currentPoints = getAwayteamPointsInCurrentSet(state);
    this.mutateAndTrack([MATCH, index, AWAYTEAM_POINT], currentPoints + 1)
  }

  load = (proxy, event, state) => {
    this.tide.setState(state);
  }



  getMatch = () => {
    return this.get(MATCH)
  }

  undo = () => {
    console.log('UNDO')
    const history = this.get([HISTORY]);
    const secondLastAction = history.pop().last();
    const matchState = secondLastAction.get(MATCHSTATE)
    
    const undoAction = [UNDO].concat(secondLastAction.get(ACTION))
    this.mutate(MATCH, original => original = matchState);
    this.mutate(HISTORY, original => original = history.pop());
    this.track(undoAction, secondLastAction.get(VALUE))
  }
}

export default AllAction