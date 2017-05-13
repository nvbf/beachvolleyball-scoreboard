import {
  TEAM,
  HOMETEAM,
  AWAYTEAM,
  ADD_POINT,
  REMOVE_POINT
} from './../constants';

export function addPointHometeam() {
	return addPoint(HOMETEAM);
}

export function addPointAwayteam() {
	return addPoint(AWAYTEAM);
}

export function removePointHometeam() {
	return removePoint(HOMETEAM);
}

export function removePointAwayteam() {
	return removePoint(AWAYTEAM);
}

function addPoint(team) {
	return {
		type: ADD_POINT,
		[TEAM]: team
	};
}

function removePoint(team) {
	return {
		type: REMOVE_POINT,
		[TEAM]: team
	};
}
