import {Tide, initActions} from 'tide';

import State from './state';
import AllAction from './actions';

import {
  constants as c
} from './state';

import {
  getCurrentSetIndex,
  getCurrentSet,
  getHistory,
  getPersonToServe,
  calculateNextPersonToServe,
  getFirstTeamToServe
} from './logic';

export default function create() {
	const tide = new Tide();
	tide.setState(new State());
	initActions(tide, {all: AllAction});
	tide.onChange(mutateSignals.bind(tide));

	return tide;
}

const personToServe = state => {
	const currentSet = getCurrentSet(state);
	const firstTeamToServe = getFirstTeamToServe(currentSet);
	const serviceOrderHomeTeam = currentSet[c.SERVICE_ORDER_HOMETEAM];
	const serviceOrderAwayTeam = currentSet[c.SERVICE_ORDER_AWAYTEAM];
	const actions = getHistory(state);

	console.log('person to servce actions:', actions);

	const personToServeI = actions
      .filter(action => {
	console.log('actionH', action);
	console.log('action[c.ACTION]', action[c.ACTION]);
	console.log('action[c.ACTION].size', action[c.ACTION].length);

	if (action && action[c.ACTION] && action[c.ACTION] && action[c.ACTION].length > 2) {
		const actionHistoryAction = action[c.ACTION][2];
		console.log('actionHistoryState', actionHistoryAction);
		return actionHistoryAction === c.HOMETEAM_POINT || actionHistoryAction === c.AWAYTEAM_POINT;
	}
	return false;
})
      .map(action => action[c.ACTION][2])
      .reduce((agg, action) => {
	console.log('reduce!!!!');
	if (((action === c.HOMETEAM_POINT && agg.serving === c.HOMETEAM) || (action === c.AWAYTEAM_POINT && agg.serving === c.AWAYTEAM))) {
		return agg;
	}
	const newNumber = agg.number + 1;
	const serving = agg.serving === c.HOMETEAM ? c.AWAYTEAM : c.HOMETEAM;
	return {
		serving,
		name: calculateNextPersonToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam, newNumber),
		number: newNumber
	};
}, {serving: firstTeamToServe, name: calculateNextPersonToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam, 0), number: 0});

	return personToServeI.name;
};

function mutateSignals() {
	const state = this.getState();
	const matchState = this.get(c.MATCH);
	const index = getCurrentSetIndex(matchState);
	const currentSet = getCurrentSet(state);
	const update = mutateIfNotEqual.bind(this);

	update([c.MATCH, c.HOMETEAM_TIMEOUT_TAKEN], matchState[index][c.HOMETEAM_TIMEOUT_TAKEN]);
	update([c.MATCH, c.AWAYTEAM_TIMEOUT_TAKEN], matchState[index][c.AWAYTEAM_TIMEOUT_TAKEN]);
	update([c.MATCH, c.SERVICE_ORDER_IS_SET], matchState[index][c.SERVICE_ORDER_IS_SET]);

	if (currentSet[c.SERVICE_ORDER_IS_SET]) {
		update([c.MATCH, index, c.PLAYER_TO_SERVE], personToServe(state));
		update([c.MATCH, c.PLAYER_TO_SERVE], personToServe(state));
	}
}

function mutateIfNotEqual(key, value) {
	const current = this.get(key);
	if (current == value) {
		return;
	}
	this.mutate(key, original => original = value);
}
