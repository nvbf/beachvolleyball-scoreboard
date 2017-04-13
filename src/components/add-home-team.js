import React, {Component} from 'react';
import { connect } from 'react-redux'

import { Button, Well }  from 'react-bootstrap';

import PlayerInput from './player-input';
import ColorPicker from './color-picker';
import AddTeamButton from './add-team-button';
import InfoArea from './info-area';

import {
	TEAM,
	HOMETEAM
} from '../domain/redux/constants';

import {
	updateFirstPlayerOnHometeam,
	updateSecondPlayerOnHometeam,
	updateColorOnHometeam
} from '../domain/redux/team/action-creator';


const Team = require('./../domain/team');

class AddHomeTeam extends Component {
	constructor(props) {
		super(props)
		this.state = { color: "#0000ff"};
	}

	handleColorPicker(colorObj) {
		this.setState({ color: colorObj.hex })
	}

	handleSubmit(e) {
		e.preventDefault();

		const {
			dispatchFirstPlayerOnHometeam,
			dispatchSecondPlayerOnHometeam,
			dispatchColorOnHometeam,
			changeState
		} = this.props;

		const player1 = document.getElementById('player1').value;
		const player2 = document.getElementById('player2').value;

		if (!player2) {
			document.getElementById('player2').focus();
			return;
		}

		dispatchFirstPlayerOnHometeam(player1)
		dispatchSecondPlayerOnHometeam(player2)
		dispatchColorOnHometeam(this.state.color);

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
						<PlayerInput />
                		<ColorPicker color={this.state.color} onColorSelect={this.handleColorPicker.bind(this)} />
              			{/* TODO: a preview og teamname and shirt color could be nice?: <Preview />*/}
              			<AddTeamButton  handleClick={this.handleSubmit.bind(this)} />
					</div>
				</div>

				<InfoArea number={1}>
					The first thing we need to do is to add the teams that are playing against each other
				</InfoArea>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log('state');
	console.log(state);
	window.state = state;
	console.log('state');
	return {
		[HOMETEAM]: state.get(TEAM).get(HOMETEAM)
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
	dispatchFirstPlayerOnHometeam: (name) => dispatch(updateFirstPlayerOnHometeam(name)),
	dispatchSecondPlayerOnHometeam: (name) => dispatch(updateSecondPlayerOnHometeam(name)),
	dispatchColorOnHometeam: (name) => dispatch(updateColorOnHometeam(name))
  }
}

const AddHomeTeamAware = connect(
	mapDispatchToProps,
  	mapStateToProps
)(AddHomeTeam)

export default AddHomeTeamAware;