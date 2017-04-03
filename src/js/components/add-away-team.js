import React, {Component} from 'react';
import ColorPicker from './color-picker';

import PlayerInput from './player-input';

const Team = require('./../domain/team');
const Button = require('react-bootstrap').Button;
const Well = require('react-bootstrap').Well;

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
						<Button onClick={this.handleSubmit.bind(this)} bsStyle="primary" className="pull-right">
              				Add Team
						</Button>
					</div>
				</div>
				<Well>
					<Button bsStyle="primary"> 2 </Button>					Great! Now lets add the second team!
				</Well>
			</div>
		);
	}
}
