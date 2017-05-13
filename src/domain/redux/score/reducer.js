import {createStore} from 'redux';
import {fromJS, Map} from 'immutable';

import {
  UPDATE_PLAYER,
  ADD_POINT,
  REMOVE_POINT,
  SCORE,
  HOMETEAM,
  FIRST_SET,
  SECOND_SET,
  THIRD_SET,
  TEAM
} from './../constants';

import {
  isFirstSetFinished,
  isSecondSetFinished,
  isThirdSetFinished,
  getCurrentSetIndex,
  getSetIndexToRemovePointFrom
} from './logic';

export const initialState = fromJS({
	[SCORE]: {
		[FIRST_SET]: [0, 0],
		[SECOND_SET]: [0, 0],
		[THIRD_SET]: [0, 0]
	}
});

const updateTeamName = players => players.get(0) + '/' + players.get(1);

export default function teamReducer(state = initialState, action = Map({})) {
	if (action.type === ADD_POINT) {
		const team = action.get(TEAM);
		return addPoint(state, team);
	}
	if (action.type === REMOVE_POINT) {
		const team = action.get(TEAM);
		return removePoint(state, team);
	}
	return state;
}

function addPoint(state, team) {
	const setNumber = getCurrentSetIndex(state.get(SCORE));
	const teamIndex = team === HOMETEAM ? 0 : 1;
	return state.updateIn([SCORE, setNumber, teamIndex], points => points + 1);
}

function removePoint(state, team) {
	const setNumber = getSetIndexToRemovePointFrom(state.get(SCORE));
	const teamIndex = team === HOMETEAM ? 0 : 1;
	return state.updateIn([SCORE, setNumber, teamIndex], points => points - 1);
}
