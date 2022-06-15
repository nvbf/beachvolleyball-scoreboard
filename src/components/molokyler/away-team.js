import React from 'react';
import {
    wrap
 } from 'tide';

import team from '../atom/team';
import {
    constants as c
} from '../../domain/tide/state';

export default wrap(team, {
	player1: [c.MATCH, c.AWAYTEAM_FIRST_PLAYER_NAME],
	player2: [c.MATCH, c.AWAYTEAM_SECOND_PLAYER_NAME],
	color: [c.MATCH, c.AWAYTEAM_COLOR]
});
