import React, {Component} from 'react';
import PlayerInput from './player-input';
import ColorPicker from './color-picker';

const Team = require('./../domain/team');
const Button = require('react-bootstrap').Button;
const Well = require('react-bootstrap').Well;

export default class AddHomeTeam extends Component {
	constructor(props) {
		super(props)
		this.state = { color: "#0000ff"};
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

		this.props.match.addHomeTeam(new Team(player1, player2, this.state.color ));

		this.props.changeState(
      {show: 'AddAwayTeam'}
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
						<h2>Lets add the first team..</h2>
					</div>
					<div className="panel-body">
						<form className="add-team-form" onSubmit={this.handleSubmit.bind(this)}>
							<PlayerInput />
                <ColorPicker color={this.state.color} onColorSelect={this.handleColorPicker.bind(this)} />
              {/* TODO: a preview og teamname and shirt color could be nice?: <Preview />*/}
							<Button type="submit" bsStyle="primary" className="pull-right">
              Add Team
							</Button>
						</form>
					</div>
				</div>

				<Well>
					<Button bsStyle="primary"> 1 </Button>					The first thing we need to do is to add the teams that are playing against each other
				</Well>
			</div>
		);
	}
}
