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
	MATCH,
	constants as c
} from '../../domain/tide/state';

class AddHomeTeam extends Component {
	constructor(props) {
		super(props);
		const color = this.props.color || '#ff0000';
		this.state = {color};
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

		this.props.tide.actions.all.mutateAndTrack([c.MATCH, c.HOMETEAM_FIRST_PLAYER_NAME], player1);
		this.props.tide.actions.all.mutateAndTrack([c.MATCH, c.HOMETEAM_SECOND_PLAYER_NAME], player2);
		this.props.tide.actions.all.mutateAndTrack([c.MATCH, c.HOMETEAM_COLOR], this.state.color);
		this.props.tide.actions.all.mutate([c.MATCH, c.SHOW_COMPONENT], c.ADD_AWAYTEAM_COMPONENT);
	}

	componentDidMount() {
		const color = this.props.color || '#ff0000';
		this.setState({color});
		document.getElementById('player1').value = this.props.name1;
		document.getElementById('player2').value = this.props.name2;
		document.getElementById('player1').focus();
	}

	render() {
		const {
			name1,
			name2
		} = this.props
		return (
			<div>
				<div className="panel panel-default">
					<div className="panel-heading">
						<h2>Home team</h2>
					</div>
					<div className="panel-body">
						<PlayerInput name1 name2/>
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
	name1: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
	name2: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	color: [MATCH, HOMETEAM_COLOR]
});
