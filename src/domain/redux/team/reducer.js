import { createStore } from 'redux';
import { fromJS, Map } from 'immutable';
import { 
  UPDATE_PLAYER,
  HOMETEAM,
  AWAYTEAM,
  FIRST_PLAYER,
  SECOND_PLAYER,
  PLAYER_NAME,
  PLAYER_NR,
  TEAM,
  COLOR,
  UPDATE_COLOR
} from './../constants';

export const  initialState = fromJS({
   [HOMETEAM]: {
     [FIRST_PLAYER]: { 
       [PLAYER_NAME]: "" 
      },
      [SECOND_PLAYER]: {
        [PLAYER_NAME]: ""
      },
      [COLOR]: ""
   },
   [AWAYTEAM]: {
     [FIRST_PLAYER]: { 
       [PLAYER_NAME]: "" 
      },
      [SECOND_PLAYER]: {
        [PLAYER_NAME]: ""
      },
      [COLOR]: ""
   }
 });


export default function teamReducer(state = initialState, action = Map({})) {
    if(action.type === UPDATE_PLAYER) {
      const team = action.get(TEAM);
      const playerNr = action.get(PLAYER_NR);
      const playerName = action.get(PLAYER_NAME);
      return state.updateIn([team, playerNr, PLAYER_NAME], () => playerName);
    }
    if(action.type === UPDATE_COLOR) {
      const team = action.get(TEAM);
      const color = action.get(COLOR)
      return state.updateIn([team, COLOR], () => color)
    }
    return state;
}

      