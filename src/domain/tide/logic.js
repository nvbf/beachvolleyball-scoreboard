import {
    FIRST_SET,
    SECOND_SET,
    THIRD_SET,
    AWAYTEAM_POINT,
    HOMETEAM_POINT,
    constants as c
} from './state';

export function getCurrentSet(state) {
	const match = state[c.MATCH];
	const index = getCurrentSetIndex(match);
	return match[index];
}

export function getHistory(state) {
	return state.HISTORY;
}

export function getMatch(state) {
	return state[c.MATCH];
}

export function getFirstTeamToServe(currentSet) {
	return currentSet[c.FIRST_TEAM_TO_SERVE];
}

export function calculateNextPersonToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam, number) {
    // Resultat mellom 0 og 4.
	const server = number % 4;

	if (server === 0) {
		return getFirstPlayerToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam);
	} else if (server === 1) {
		return getSecondPlayerToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam);
	} else if (server === 2) {
		return getThirdPlayerToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam);
	} else if (server === 3) {
		return getFourthPlayerToServe(firstTeamToServe, serviceOrderHomeTeam, serviceOrderAwayTeam);
	}
}

function getFirstPlayerToServe(firstTeamtoServe, serviceOrderHomeTeam, serviceOrderAwayTeam, ) {
	if (firstTeamtoServe === c.HOMETEAM) {
		return serviceOrderHomeTeam.first();
	}
	return serviceOrderAwayTeam.first();
}

function getSecondPlayerToServe(firstTeamtoServe, serviceOrderHomeTeam, serviceOrderAwayTeam, ) {
	if (firstTeamtoServe === c.HOMETEAM) {
		return serviceOrderAwayTeam.first();
	}
	return serviceOrderHomeTeam.first();
}

function getThirdPlayerToServe(firstTeamtoServe, serviceOrderHomeTeam, serviceOrderAwayTeam, ) {
	if (firstTeamtoServe === c.HOMETEAM) {
		return serviceOrderHomeTeam.last();
	}
	return serviceOrderAwayTeam.last();
}

function getFourthPlayerToServe(firstTeamtoServe, serviceOrderHomeTeam, serviceOrderAwayTeam, ) {
	if (firstTeamtoServe === c.HOMETEAM) {
		return serviceOrderAwayTeam.last();
	}
	return serviceOrderHomeTeam.last();
}

export function getFirstePersonToServe(state) {
	const currentSet = getCurrentSet(state);
	const firstTeamToServe = getFirstTeamToServe(currentSet);
	return (firstTeamToServe === c.HOMETEAM) ? currentSet[c.SERVICE_ORDER_HOMETEAM].first() : currentSet[c.SERVICE_ORDER_AWAYTEAMM].first();
}

export function getCurrentSetIndex(match) {
	if (!isFirstSetFinished(match)) {
		return FIRST_SET;
	}
	if (!isSecondSetFinished(match)) {
		return SECOND_SET;
	}
	if (!isThirdSetFinished(match)) {
		return THIRD_SET;
	}
	throw 'You should never be here!' + match;
}

export function getHometeamPointsInCurrentSet(score) {
	const index = getCurrentSetIndex(score);
	return score[index][HOMETEAM_POINT];
}

export function getAwayteamPointsInCurrentSet(score) {
	const index = getCurrentSetIndex(score);
	return score[index][AWAYTEAM_POINT];
}

export function getSetIndexToRemovePointFrom(score) {
	if (isThirdSetStarted(score)) {
		return THIRD_SET;
	}
	if (isSecondSetStarted(score)) {
		return SECOND_SET;
	}
	return FIRST_SET;
}

export function isFirstSetFinished(score) {
	return isSetFinished(score.get(FIRST_SET));
}

export function isSecondSetFinished(score) {
	return isSetFinished(score.get(SECOND_SET));
}

export function isThirdSetFinished(score) {
	return isSetFinished(score.get(THIRD_SET));
}

export function isFirstSetStarted(score) {
	return isSetStarted(score.get(FIRST_SET));
}

export function isSecondSetStarted(score) {
	return isSetStarted(score.get(SECOND_SET));
}

export function isThirdSetStarted(score) {
	return isSetStarted(score.get(THIRD_SET));
}

export function isSetStarted(aSet) {
	return (aSet.get(HOMETEAM_POINT) !== 0 && aSet.get(AWAYTEAM_POINT) !== 0);
}

export function isSetFinished(aSet) {
	console.log('aset:', aSet);
	return (hasHometeamWonSet(aSet)) || (hasAwayteamWonSet(aSet));
}

export function isMatchFinished(state) {
	const score = state[c.MATCH];
	return (
        hasHometeamWonThirdSet(score) ||
        hasAwayteamWonThirdSet(score) ||
        hasHometeamWonFirstSet(score) && hasHometeamWonSecondSet(score) ||
        hasAwayteamWonFirstSet(score) && hasAwayteamWonSecondSet(score)
	);
}

function hasHometeamWonFirstSet(score) {
	return hasHometeamWonSet(score.get(FIRST_SET));
}

function hasHometeamWonSecondSet(score) {
	return hasHometeamWonSet(score.get(SECOND_SET));
}

function hasHometeamWonThirdSet(score) {
	return hasHometeamWonSet(score.get(THIRD_SET));
}

function hasAwayteamWonFirstSet(score) {
	return hasAwayteamWonSet(score.get(FIRST_SET));
}

function hasAwayteamWonSecondSet(score) {
	return hasAwayteamWonSet(score.get(SECOND_SET));
}

function hasAwayteamWonThirdSet(score) {
	return hasAwayteamWonSet(score.get(THIRD_SET));
}

function hasAwayteamWonSet(aSet) {
	const point1 = aSet.get(HOMETEAM_POINT);
	const point2 = aSet.get(AWAYTEAM_POINT);
	const awayteamHas21orMorePoints = point2 >= 21;
	const awayteamHas2orMorePointThenHometeam = point2 > (point1 + 1);
	return awayteamHas21orMorePoints && awayteamHas2orMorePointThenHometeam;
}

function hasHometeamWonSet(aSet) {
	const point1 = aSet.get(HOMETEAM_POINT);
	const point2 = aSet.get(AWAYTEAM_POINT);
	const hometeamHas21orMorePoints = point1 >= 21;
	const hometeamHas2orMorePointThenAwayteam = point1 > (point2 + 1);
	console.log('hometeamHas2orMorePointThenAwayteam', hometeamHas2orMorePointThenAwayteam);
	console.log('hometeamHas21orMorePoints', hometeamHas21orMorePoints);
	console.log('hasHometeamWonSet', (hometeamHas21orMorePoints && hometeamHas2orMorePointThenAwayteam));
	return hometeamHas21orMorePoints && hometeamHas2orMorePointThenAwayteam;
}

