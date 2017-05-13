import {
  UPDATE_PLAYER,
  TEAM,
  PLAYER_NR,
  HOMETEAM,
  AWAYTEAM,
  FIRST_PLAYER,
  SECOND_PLAYER,
  PLAYER_NAME,
  COLOR,
  UPDATE_COLOR
} from './../constants';

export function updateFirstPlayerOnHometeam(playerName) {
	return updatePlayer(HOMETEAM, FIRST_PLAYER, playerName);
}

export function updateSecondPlayerOnHometeam(playerName) {
	return updatePlayer(HOMETEAM, SECOND_PLAYER, playerName);
}

export function updateFirstPlayerOnAwayteam(playerName) {
	return updatePlayer(AWAYTEAM, FIRST_PLAYER, playerName);
}

export function updateSecondPlayerOnAwayteam(playerName) {
	return updatePlayer(AWAYTEAM, SECOND_PLAYER, playerName);
}

export function updateColorOnAwayteam(color) {
	return updateColor(AWAYTEAM, color);
}

export function updateColorOnHometeam(color) {
	return updateColor(AWAYTEAM, color);
}

function updateColor(team, color) {
	return {
		type: UPDATE_COLOR,
		[COLOR]: color
	};
}

function updatePlayer(team, player, playerName) {
	return {
		type: UPDATE_PLAYER,
		[TEAM]: team,
		[PLAYER_NR]: player,
		[PLAYER_NAME]: playerName
	};
}
