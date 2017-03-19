import { createStore } from 'redux';
import { fromJS } from 'immutable';
import { UPDATE_PLAYER } from './../constants';

const initialState = fromJS({
  currentSet = 1,
   score: {
     "1": [0,0],
     "2": [0,0],
     "3": [0,0],
  }
});


const updateTeamName = players => players.get(0) + '/' + players.get(1)

export function teamReducer(state = initialState, action) {
    if(action.type === ADD_POINT_HOMETEAM) {
      const team = action.payload.get('score');
      const player = action.payload.get('player');
      const playerName = action.payload.get('playerName');
      return state.updateIn([team, "players", player], () => playerName);
    }
    if(action.type === REMOVE_POINT_HOMETEAM) {
      const team = action.payload.get('score');
      const player = action.payload.get('player');
      const playerName = action.payload.get('playerName');
      return state.updateIn([team, "players", player], () => playerName);
    }
    if(action.type === ADD_POINT_AWAYTEAM) {
      const team = action.payload.get('score');
      const player = action.payload.get('player');
      const playerName = action.payload.get('playerName');
      return state.updateIn([team, "players", player], () => playerName);
    }
    if(action.type === REMOVE_POINT_AWAYTEAM) {
      const team = action.payload.get('score');
      const player = action.payload.get('player');
      const playerName = action.payload.get('playerName');
      return state.updateIn([team, "players", player], () => playerName);
    }

    return state;
}
