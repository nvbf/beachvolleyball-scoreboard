import {Map} from 'immutable'
import {Actions} from 'tide'

import {
	ACTION_HISTORY, 
  HISTORY,
  MATCH_ID
} from './state';

class AllAction extends Actions {
  mutateAndTrack(key, value) {
      this.mutate(key, (original) => original = value);
      const currentState = this.getState();

      //TODO: The ACTION_HISTORY is never replaced even on undo!
      this.mutate(ACTION_HISTORY, (history) => history.push(Map({key, value})))
      
      this.mutate(HISTORY, (history) => history.push(currentState))
      storeToLocalStorage(this.getState());
  }

  homeTeamTakeTimeout() {

  }
}


function storeToLocalStorage(state) {
  const stateAsJS = JSON.stringify(state)
  const matchID = state[MATCH_ID] || 'Match-0'
  try {
    localStorage.setItem(matchID, stateAsJS)
  } catch(err) {
    console.error('Error on storing match object', matchID, state)
  }
}

export default AllAction