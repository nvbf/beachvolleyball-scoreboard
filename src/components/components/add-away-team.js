import React, {Component} from 'react';
import { Button, Well } from 'react-bootstrap'
import {wrap} from 'tide'

import ColorPicker from './../atom/color-picker';
import AddTeamButton from './../atom/add-team-button';
import PlayerInput from './../molokyler/player-input';
import InfoArea from './../molokyler/info-area';

import {
	AWAYTEAM_FIRST_PLAYER_NAME, 
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,
	SHOW_COMPONENT,
	SCOREBOARD_COMPONENT,
} from '../../domain/tide/state';

class AddAwayTeam extends Component {
	constructor(props) {
		super(props)
		this.state = { color: "#ff0000"};
	}

	handleColorPicker(colorObj) {
		this.setState({ color: colorObj.hex })
	}


	handleSubmit(e) {
		e.preventDefault();
		const player1 = document.getElementById('player1').value;
	 	const player2 = document.getElementById('player2').value;

		if (!player2) {
			document.getElementById('player2').focus();
			return;
		}

		this.props.tide.actions.all.mutateAndTrack(AWAYTEAM_FIRST_PLAYER_NAME, player1)
		this.props.tide.actions.all.mutateAndTrack(AWAYTEAM_SECOND_PLAYER_NAME, player2)
		this.props.tide.actions.all.mutateAndTrack(AWAYTEAM_COLOR, this.state.color)
		this.props.tide.actions.all.mutateAndTrack(SHOW_COMPONENT, SCOREBOARD_COMPONENT)
	}	

	componentDidMount() {
		document.getElementById('player1').focus();
	}

	render() {
		return (
			<div>
				<div className="panel panel-default">
					<div className="panel-heading">
						<h2>..and now the other team!</h2>
					</div>
					<div className="panel-body">
						<PlayerInput />
                		<ColorPicker color={this.state.color} onColorSelect={this.handleColorPicker.bind(this)} />
						<AddTeamButton  handleClick={this.handleSubmit.bind(this)} />
					</div>
				</div>
				<InfoArea number={2}>
					Great! Now lets add the second team!
				</InfoArea>
			</div>
		);
	}
}


export default wrap(AddAwayTeam, {
		[AWAYTEAM_FIRST_PLAYER_NAME]: AWAYTEAM_FIRST_PLAYER_NAME,
		[AWAYTEAM_SECOND_PLAYER_NAME]: AWAYTEAM_SECOND_PLAYER_NAME,
	 	[AWAYTEAM_COLOR]: AWAYTEAM_COLOR
});