import React, {Component} from 'react';
import {wrap} from 'tide'

import ScoreboardRow from './../molokyler/scoreboard-row';
import InfoArea from './../molokyler/info-area';
import MatchDetails from './../match-details'
import NotificationAlerts from './../notification-alerts';

const ServeOrder = require('../molokyler/serve-order');
const Timeout = require('../timeout');
import  TimeoutButtons from '../timeout-buttons';

import AlertInfo from '../atom/alert-info';

import {
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,

	AWAYTEAM_FIRST_PLAYER_NAME,
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,
} from '../../domain/tide/state';




class Scoreboard extends Component {
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
										team={{
											player1: this.props[HOMETEAM_FIRST_PLAYER_NAME],
											player2: this.props[HOMETEAM_SECOND_PLAYER_NAME]
										}}
										teamColor={this.props[HOMETEAM_COLOR]}
										match={this.props.match}/>
									<ScoreboardRow
										pointsToTeam={this.pointToAwayTeam()}
										removePoint={this.removePointAwayTeam()}
										scoreForThisTeam={scoreAwayTeam}
										team={{
											player1: this.props[AWAYTEAM_FIRST_PLAYER_NAME],
											player2: this.props[AWAYTEAM_SECOND_PLAYER_NAME]
										}}
										teamColor={this.props[AWAYTEAM_COLOR]}
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

export default wrap(Scoreboard, {
	[HOMETEAM_FIRST_PLAYER_NAME]: HOMETEAM_FIRST_PLAYER_NAME,
	[HOMETEAM_SECOND_PLAYER_NAME]: HOMETEAM_SECOND_PLAYER_NAME,
	[HOMETEAM_COLOR]: HOMETEAM_COLOR,
	[AWAYTEAM_FIRST_PLAYER_NAME]: AWAYTEAM_FIRST_PLAYER_NAME,
	[AWAYTEAM_SECOND_PLAYER_NAME]: AWAYTEAM_SECOND_PLAYER_NAME,
	[AWAYTEAM_COLOR]: AWAYTEAM_COLOR,
});

