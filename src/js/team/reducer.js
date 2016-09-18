import { createStore } from 'redux';
import { fromJS } from 'immutable';
import { UPDATE_PLAYER } from './../constants';

const initialState = fromJS({
   hometeam: {
     players: { player1 : "", player2: "" }
   },
   awayteam: {
     players: { player1 : "", player2: ""}
   }
 });



const updateTeamName = players => players.get(0) + '/' + players.get(1)

export function teamReducer(state = initialState, action) {
    if(action.type === UPDATE_PLAYER) {
      const team = action.payload.get('team');
      const player = action.payload.get('player');
      const playerName = action.payload.get('playerName');
      return state.updateIn([team, "players", player], () => playerName);
    }
    return state;
}
