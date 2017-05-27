import React from 'react';
import styled from 'styled-components';
import printf from 'printf';
import moment from 'moment';
import List from 'immutable';

import DetailToogle from './detail-toggle';
import {Alert} from 'react-bootstrap';

import {
	MATCH,
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,
	AWAYTEAM_FIRST_PLAYER_NAME,
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,
	FIRST_SET,
	SECOND_SET,
	THIRD_SET,
	AWAYTEAM_POINT,
	HOMETEAM_POINT,
	MATCH_IS_FINISED,
	ACTION_HISTORY,
    ACTION,
    VALUE,
    DATE,
    MATCHSTATE,
    UNDO,
    AWAYTEAM_TIMEOUT_TAKEN,
    HOMETEAM_TIMEOUT_TAKEN,
	constants as c
} from '../domain/tide/state';

const constantToText = {
	[AWAYTEAM_COLOR]: 'Away team has color %s',
	[HOMETEAM_COLOR]: 'Home team has color %s',
	[AWAYTEAM_FIRST_PLAYER_NAME]: 'Name set to %s for Player 1 on the away team',
	[AWAYTEAM_SECOND_PLAYER_NAME]: 'Name set to %s for Player 2 on the away team',
	[HOMETEAM_FIRST_PLAYER_NAME]: 'Name set to %s for Player 2 on the home team',
	[HOMETEAM_SECOND_PLAYER_NAME]: 'Name set to %s for Player 2 on the home team',
	[AWAYTEAM_POINT]: 'Away team got a point, they have now %s points',
	[HOMETEAM_POINT]: 'Home team got a point, they have now %s points',
	[AWAYTEAM_TIMEOUT_TAKEN]: 'Away team is taking a timout',
	[HOMETEAM_TIMEOUT_TAKEN]: 'Home team is taking a timout',
	[c.COMMENTS]: 'Comment: %s'
};

export default function MatchDetails({events, showDetails, handleDetailToogle}) {
	const eventsComponent = events
        .map((actionHistory, index) => {
	const actions = actionHistory.get(ACTION);
	const lastKey = getKey(actions);
	const isUndo = actions[0] === UNDO;
	const tekstString = constantToText[lastKey];
	const value = actionHistory.get(VALUE);
	const date = actionHistory.get(DATE);
	const relativeTime = moment(date).format('HH:mm:ss');
	const undoInfo = isUndo ? 'UNDO:' : '';
	const homeScore = actionHistory.get(HOMETEAM_POINT);
	const awayScore = actionHistory.get(AWAYTEAM_POINT);
	if (tekstString === undefined) {
		console.log('Skipping', lastKey)
		return;
	}
	return (<p key={index}>{printf(`${undoInfo} ${relativeTime}, ${homeScore}-${awayScore}, ${tekstString}`, value)} </p>);
});

	return (
		<Alert bsStyle="info">
			<h3 style={{display: 'inline-flex'}}/>
			<DetailToogle
				checked={showDetails}
				onChange={handleDetailToogle}
				/>
			{eventsComponent.reverse()}

		</Alert>
	);
}

function getKey(actions) {
	if (List.is(actions)) {
		return actions.list();
	}
	return Array.isArray(actions) ? actions[actions.length - 1] : actions;
}
