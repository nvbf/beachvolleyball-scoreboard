import React, {Component} from 'react';
import { Button, Well } from 'react-bootstrap'

import ColorPicker from './color-picker';
import AddTeamButton from './add-team-button';
import PlayerInput from './player-input';
import InfoArea from './info-area';

const Team = require('./../domain/team');

export default class AddAwayTeam extends Component {
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

		this.props.match.addAwayTeam(new Team(player1, player2, this.state.color ));

		this.props.changeState(
      		{show: 'Scoreboard'}
    	);
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
0