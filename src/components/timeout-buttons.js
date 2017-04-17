import hexToRGBA from './utils/rgba';

const React = require('react');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Label = require('react-bootstrap').Label;
import {wrap} from 'tide'

import {
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,

	AWAYTEAM_FIRST_PLAYER_NAME,
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,

} from '../domain/tide/state';

const TimeoutMenu = React.createClass({
	restart() {
		location.reload();
	},

	showTimeout() {
		this.props.match.notification.emit('timeout-notification');
	},

	onTimeoutHomeTeam(e) {
		e.preventDefault();
		this.props.match.homeTeamTakesTimeout();
		this.props.updateState(this.props.match.state);
		this.showTimeout();
	},

	onTimeoutAwayTeam(e) {
		e.preventDefault();
		this.props.match.awayTeamTakesTimeout();
		this.props.updateState(this.props.match.state);
		this.showTimeout(this.props.match.state.awayteam.display());
	},

	render() {
		const {
			match
		} = this.props;
		const homeTimeTimeoutStyles = { backgroundColor: hexToRGBA(match.homeTeamColor())}
		const awayTimeTimeoutStyles = { backgroundColor: hexToRGBA(match.awayTeamColor())}
		
		return (
			<div>
				<Label>Timeout</Label>
				<ButtonToolbar>
					<Button
						type="submit"
						className={(this.props.homeTeamTimeout != 0 ? 'disabled' : '')}
						style={homeTimeTimeoutStyles}
						onClick={this.onTimeoutHomeTeam}
					>
						{this.props.match.state.hometeam.display()}
					</Button>
					<Button
						type="submit"
						className={(this.props.awayTeamTimeout != 0 ? 'disabled' : '')}
						style={awayTimeTimeoutStyles}
						onClick={this.onTimeoutAwayTeam}
					>
						{this.props.match.state.awayteam.display()}
					</Button>
					<Button bsStyle="danger" type="submit" className="pull-right" onClick={this.restart}>
            New Match
					</Button>
				</ButtonToolbar>
			</div>
		);
	}
});

export default wrap(TimeoutMenu, {
		[HOMETEAM_FIRST_PLAYER_NAME]: HOMETEAM_FIRST_PLAYER_NAME,
		[HOMETEAM_SECOND_PLAYER_NAME]: HOMETEAM_SECOND_PLAYER_NAME,
	 	[HOMETEAM_COLOR]: HOMETEAM_COLOR, 
		[AWAYTEAM_FIRST_PLAYER_NAME]: AWAYTEAM_FIRST_PLAYER_NAME,
		[AWAYTEAM_SECOND_PLAYER_NAME]: AWAYTEAM_SECOND_PLAYER_NAME,
	 	[AWAYTEAM_COLOR]: AWAYTEAM_COLOR,		 
});