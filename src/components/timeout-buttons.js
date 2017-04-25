import React from 'react';
import {
	 Button,
	 ButtonToolbar, 
	 Label
} from 'react-bootstrap';
import TeamColorLabel from './atom/team-color-label'

import {wrap} from 'tide'

import {
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,
	MATCH,
	AWAYTEAM_FIRST_PLAYER_NAME,
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,

	HOMETEAM_TIMEOUT_TAKEN,
	AWAYTEAM_TIMEOUT_TAKEN

} from '../domain/tide/state';

class TimeoutMenu extends React.Component {
	render() {
		const {
			HOMETEAM_COLOR,
			AWAYTEAM_COLOR,
			HOMETEAM_FIRST_PLAYER_NAME,
			HOMETEAM_SECOND_PLAYER_NAME,
			AWAYTEAM_FIRST_PLAYER_NAME,
			AWAYTEAM_SECOND_PLAYER_NAME,
			HOMETEAM_TIMEOUT_TAKEN,
			AWAYTEAM_TIMEOUT_TAKEN,
			tide : {
				actions: {
					all
				}
			}
		} = this.props
		
		return (
			<div>
				<Label>Timeout</Label>
				<ButtonToolbar>
					<Button
						type="submit"
						className={(HOMETEAM_TIMEOUT_TAKEN ? 'disabled' : '')}
						onClick={all.hometeamTakeTimeout}
					>
						<TeamColorLabel color={HOMETEAM_COLOR}> 
						</TeamColorLabel> {HOMETEAM_FIRST_PLAYER_NAME} - {HOMETEAM_SECOND_PLAYER_NAME}
					</Button>
					<Button
						type="submit"
						className={(AWAYTEAM_TIMEOUT_TAKEN ? 'disabled' : '')}
						onClick={all.awayteamTakeTimeout}
					>
						<TeamColorLabel color={AWAYTEAM_COLOR}> 
						</TeamColorLabel>  {AWAYTEAM_FIRST_PLAYER_NAME} - {AWAYTEAM_SECOND_PLAYER_NAME}
					</Button>
					<Button bsStyle="warning" type="submit" className="pull-right" onClick={all.undo}>
            			Undo
					</Button>					
				</ButtonToolbar>
			</div>
		);
	}
}

export default wrap(TimeoutMenu, {
		[HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
		[HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	 	[HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR], 
		[AWAYTEAM_FIRST_PLAYER_NAME]: [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
		[AWAYTEAM_SECOND_PLAYER_NAME]: [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
	 	[AWAYTEAM_COLOR]: [MATCH, AWAYTEAM_COLOR],
		[HOMETEAM_TIMEOUT_TAKEN]: [MATCH, HOMETEAM_TIMEOUT_TAKEN],
		[AWAYTEAM_TIMEOUT_TAKEN]: [MATCH, AWAYTEAM_TIMEOUT_TAKEN],
});