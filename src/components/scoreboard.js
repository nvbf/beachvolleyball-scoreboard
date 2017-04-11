import React, {Component} from 'react';

import ScoreboardRow from './scoreboard-row';
import InfoArea from './info-area';
import MatchDetails from './match-details'

const NotificationAlerts = require('./notification-alerts');
const ServeOrder = require('./serve-order');
const Timeout = require('./timeout');
const TimeoutButtons = require('./timeout-buttons');

const AlertInfo = require('./alert-info');

export default class Scoreboard extends Component {
	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.props.match.state, {showDetails: false, events: []})
	}

	componentDidMount() {
		this.props.match.notification.on('match-notification', () => {
			this.props.match.state.finished = true;
			this.setState(this.props.match.state);
		});

		this.props.match.notification.on('set-notification', () => {
			const state = this.props.match.state;
			state.homeTeamTimeout = 0;
			state.awayTeamTimeout = 0;
			this.setState(state);
		});

		this.props.match.notification.on('*', (event) => {
			const newEvents = events.slice();
			newEvents.push(event)
			this.setState({ events: newEvents });
		})
	}
	
	handleDetailToogle() {
		this.setState({showDetails: !this.state.showDetails })
	}

	pointToHomeTeam(event) {
		return function (event) {
			event.preventDefault();
			this.props.match.getCurrentSet().addPointHomeTeam();
			this.setState(this.props.match.state);
		}.bind(this);
	}

	removePointHomeTeam(event) {
		return function (event) {
			event.preventDefault();
			this.props.match.getCurrentSet().removePointHomeTeam();
			this.setState(this.props.match.state);
		}.bind(this);
	}

	pointToHomeTeam(event) {
		return function (event) {
			event.preventDefault();
			this.props.match.getCurrentSet().addPointHomeTeam();
			this.setState(this.props.match.state);
		}.bind(this);
	}

	removePointAwayTeam(event) {
		return function (event) {
			event.preventDefault();
			this.props.match.getCurrentSet().removePointAwayTeam();
			this.setState(this.props.match.state);
		}.bind(this);
	}

	pointToAwayTeam(event) {
		return function (event) {
			event.preventDefault();
			this.props.match.getCurrentSet().addPointAwayTeam();
			this.setState(this.props.match.state);
		}.bind(this);
	}

	updateState() {
		return function (state) {
			this.setState(state);
		}.bind(this);
	}

	render() {
		const scoreAwayTeam = [
			this.state.sets[0].score[1],
			this.state.sets[1].score[1],
			this.state.sets[2].score[1]
		];

		const scoreHomeTeam = [
			this.state.sets[0].score[0],
			this.state.sets[1].score[0],
			this.state.sets[2].score[0]
		];

		// TODO: this is not a pure component now, fix
		if (window.socket) {
			window.socket.emit('match-update', getScoreAndTeam(this.props.match.state));
		}

		return (
			<div>
				<div className="container scoreboard">
					<div className="switch-modal">
						<NotificationAlerts
							message="Switch"
							eventTrigger="switch-notification"
							notification={this.props.match.notification}/>
					</div>
					<div className="timeout-alerts">
						<Timeout
							seconds={45} message="Timeout: "
							eventTrigger="timeout-notification"
							notification={this.props.match.notification}/>
					</div>
					<div className="timeout-alerts">
						<Timeout
							seconds={45} message="Technical time-out: "
							eventTrigger="tto-notification" notification={this.props.match.notification}/>
					</div>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h2 className="panel-title">Match standing</h2>
						</div>
						<div className="panel-body">
							<table className="table table-striped">
								<thead>
									<tr>
										<td>Teams</td>
										<td>Set 1</td>
										<td>Set 2</td>
										<td>Set 3</td>
										<td>Add Point</td>
										<td>Remove Point</td>
									</tr>
								</thead>
								<tbody>
									<ScoreboardRow
										pointsToTeam={this.pointToHomeTeam()}
										removePoint={this.removePointHomeTeam()}
										scoreForThisTeam={scoreHomeTeam}
										team={this.props.match.homeTeam()}
										teamColor={this.props.match.homeTeamColor()}
										match={this.props.match}/>
									<ScoreboardRow
										pointsToTeam={this.pointToAwayTeam()}
										removePoint={this.removePointAwayTeam()}
										scoreForThisTeam={scoreAwayTeam}
										team={this.props.match.awayTeam()}
										teamColor={this.props.match.awayTeamColor()}
										match={this.props.match}/>
								</tbody>
							</table>
						</div>
						<div className="panel-footer">
							<TimeoutButtons
								homeTeamTimeout={this.state.homeTeamTimeout}
								awayTeamTimeout={this.state.awayTeamTimeout}
								match={this.props.match}
								updateState={this.updateState()}
							/>
						</div>
					</div>
					<ServeOrder match={this.props.match}/>
					<section className="events">
						<MatchDetails 
							events={this.state.events}
							showDetails={this.state.showDetails}
							handleDetailToogle={this.handleDetailToogle.bind(this)}
						/>
					</section>
					
					<InfoArea number={3}>
						You can set the service order by clicking the "Set service order" button above. (Optional)
					</InfoArea>
					<InfoArea number={4}>
						 Now you kan keep score with the blue buttons right under "Add Point"
					</InfoArea>
					<h2>Notes for first time users</h2>
					<AlertInfo message='If you do a mistake, you can adjust the score by also using the buttons below "remove point" to get the score right.' />
					<AlertInfo message="When you have set the service order, we will help you keep track of how is serving, It's almost magic." />
					<AlertInfo message='Want to start over or register a new match?  Click on the "new match button"!' />
					<AlertInfo message="You can not set the service order for a set after a points is given" />
					<AlertInfo message="For now it's not possible to change the score after a set or the match is finished."/>
					<AlertInfo message="If you need to use the remove points button the service order may be wrong afterwards! ."/>
				</div>
			</div>
		);
	}
}

Scoreboard.propTypes = {
	match: React.PropTypes.object.isRequired
};



function getScoreAndTeam(state) {
	return {
		id: hashCode(state.hometeam.state.player1 + state.hometeam.state.player2 +
      state.awayteam.state.player1 + state.awayteam.state.player2),
		homeTeam: state.hometeam.state,
		awayTeam: state.awayteam.state,
		sets: [state.sets[0].score, state.sets[1].score, state.sets[2].score]
	};
}

function hashCode(hashString) {
	let hash = 0;
	let i;
	let chr;
	let len;
	if (hashString.length === 0) {
		return hash;
	}
	for (i = 0, len = hashString.length; i < len; i++) {
		chr = hashString.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

