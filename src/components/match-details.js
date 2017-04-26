import React from 'react'
import styled from 'styled-components';
import printf from 'printf'
import moment from 'moment'

import DetailToogle from './detail-toggle';
import { Alert } from 'react-bootstrap';

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
} from '../domain/tide/state';

import {
    getHometeamPointsInCurrentSet,
    getAwayteamPointsInCurrentSet
} from '../domain/tide/logic';

const constantToText = {
    [AWAYTEAM_COLOR]: "Away team has color %s",
    [HOMETEAM_COLOR]: "Home team has color %s",
    [AWAYTEAM_FIRST_PLAYER_NAME]: "Name set to %s for Player 1 on the away team",
    [AWAYTEAM_SECOND_PLAYER_NAME]: "Name set to %s for Player 2 on the away team",
    [HOMETEAM_FIRST_PLAYER_NAME]: "Name set to %s for Player 2 on the home team",
    [HOMETEAM_SECOND_PLAYER_NAME]: "Name set to %s for Player 2 on the home team",
    [AWAYTEAM_POINT]: "Away team got a point, they have now %s points",
    [HOMETEAM_POINT]: "Home team got a point, they have now %s points",
    [AWAYTEAM_TIMEOUT_TAKEN]: "Away team is taking a timout",
    [HOMETEAM_TIMEOUT_TAKEN]: "Home team is taking a timout"
}

export default function MatchDetails({events, showDetails, handleDetailToogle}) {   
    const eventsComponent = events
        .map((event, index) => {
            const actions = event.get(ACTION);
            const lastKey = Array.isArray(actions) ? actions[actions.length - 1]: actions
            const isUndo = actions[0] === UNDO
            const tekstString = constantToText[lastKey]
            const value = event.get(VALUE);
            const date = event.get(DATE);
            const relativeTime = moment(date).format("HH:mm:ss");
            const undoInfo = isUndo ? "UNDO:" : ""
            const match = event.get(MATCHSTATE)
            const homeScore = getHometeamPointsInCurrentSet(match)
            const awayScore = getAwayteamPointsInCurrentSet(match)
            if(tekstString === undefined) {
                console.log('Skipping', lastKey)
                return;
            }
            return (<p key={index}>{printf(`${undoInfo} ${relativeTime}, ${homeScore}-${awayScore}, ${tekstString}`, value)} </p>);
        });
    
    return (
        <Alert bsStyle="info">
            <h3 style={{display: "inline-flex"}} ></h3>
             <DetailToogle checked={showDetails}
                onChange={handleDetailToogle} /> 
             {eventsComponent.reverse()}
             
         </Alert>
    )
}