import { createStore } from 'redux';
import { fromJS } from 'immutable';
import { 
  UPDATE_PLAYER,
  HOMETEAM,
  AWAYTEAM,
  FIRST_PLAYER,
  SECOND_PLAYER,
  PLAYER_NAME,
  PLAYER_NR,
  TEAM
} from './../constants';

const initialState = fromJS({
   [HOMETEAM]: {
     [FIRST_PLAYER]: { 
       [PLAYER_NAME]: "" 
      },
      [SECOND_PLAYER]: {
        [PLAYER_NAME]: ""
      }
   },
   [AWAYTEAM]: {
     [FIRST_PLAYER]: { 
       [PLAYER_NAME]: "" 
      },
      [SECOND_PLAYER]: {
        [PLAYER_NAME]: ""
      }
   }
 });


export default function teamReducer(state = initialState, action) {
    if(action.get('type') === UPDATE_PLAYER) {
      const team = action.get(TEAM);
      const playerNr = action.get(PLAYER_NR);
      const playerName = action.get(PLAYER_NAME);
      return state.updateIn([team, playerNr, PLAYER_NAME], () => playerName);
    }
    return state;
}