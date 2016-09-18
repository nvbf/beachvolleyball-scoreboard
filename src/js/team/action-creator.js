import { Map } from 'immutable';
import { UPDATE_PLAYER } from './../constants';

export function updatePlayer(team, player, playerName) {
  return {
    type: UPDATE_PLAYER,
    payload: Map({ team, player, playerName})
  }
}
