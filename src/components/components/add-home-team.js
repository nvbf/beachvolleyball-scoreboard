import React, {Component} from 'react';
import {Button, Well} from 'react-bootstrap';
import {wrap} from 'tide';

import PlayerInput from './../molokyler/player-input';
import ColorPicker from '../atom/color-picker';
import AddTeamButton from '../atom/add-team-button';
import InfoArea from './../molokyler/info-area';

import {
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,
	SHOW_COMPONENT,
	ADD_AWAYTEAM_COMPONENT,
	MATCH
} from '../../domain/tide/state';

class AddHomeTeam extends Component {
	constructor(props) {
		super(props);
		this.state = {color: '#0000ff'};
	}

	handleColorPicker(colorObj) {
		this.setState({color: colorObj.hex});
	}

	handleSubmit(e) {
		e.preventDefault();
		const player1 = document.getElementById('player1').value;
	 	const player2 = document.getElementById('player2').value;

		if (!player2) {
			document.getElementById('player2').focus();
			return;
		}

		this.props.tide.actions.all.mutateAndTrack([MATCH, HOMETEAM_FIRST_PLAYER_NAME], player1);
		this.props.tide.actions.all.mutateAndTrack([MATCH, HOMETEAM_SECOND_PLAYER_NAME], player2);
		this.props.tide.actions.all.mutateAndTrack([MATCH, HOMETEAM_COLOR], this.state.color);
		this.props.tide.actions.all.mutateAndTrack([MATCH, SHOW_COMPONENT], ADD_AWAYTEAM_COMPONENT);
	}

	componentDidMount() {
		document.getElementById('player1').focus();
	}

	render() {
		return (
			<div>
				<div className="panel panel-default">
					<div className="panel-heading">
						<h2>Home team</h2>
					</div>
					<div className="panel-body">
						<PlayerInput/>
						<ColorPicker color={this.state.color} onColorSelect={this.handleColorPicker.bind(this)}/>
						<AddTeamButton handleClick={this.handleSubmit.bind(this)}/>
					</div>
				</div>

				<InfoArea number="ℹ">
					The first thing we need to do is to add the name of the players to the home team
				</InfoArea>
				<InfoArea number="ℹ">
					Pick and color for the team, or it will default to blue.
				</InfoArea>
			</div>
		);
	}
}

export default wrap(AddHomeTeam, {
	[HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
	[HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	 	[HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR]
});