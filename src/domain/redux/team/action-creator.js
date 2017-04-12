import { Map } from 'immutable';
import { 
  UPDATE_PLAYER,
  TEAM, 
  PLAYER_NR,
  HOMETEAM,
  AWAYTEAM,
  FIRST_PLAYER,
  SECOND_PLAYER,
  PLAYER_NAME
} from './../constants';

export function updateFirstPlayerOnHometeam(playerName) {
  return updatePlayer(HOMETEAM, FIRST_PLAYER, playerName)
}

export function updateSecondPlayerOnHometeam(playerName) {
  return updatePlayer(HOMETEAM, SECOND_PLAYER, playerName)
}

export function updateFirstPlayerOnAwayteam(playerName) {
  return updatePlayer(AWAYTEAM, FIRST_PLAYER, playerName)
}

export function updateSecondPlayerOnAwayteam(playerName) {
  return updatePlayer(AWAYTEAM, SECOND_PLAYER, playerName)
}

function updatePlayer(team, player, playerName) {
  return Map({
      'type': UPDATE_PLAYER,
      [TEAM]: team,
      [PLAYER_NR]: player,
      [PLAYER_NAME]: playerName
    })
}