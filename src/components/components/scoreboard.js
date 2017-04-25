import React, {Component} from 'react';
import {wrap} from 'tide'

import ScoreboardRow from './../molokyler/scoreboard-row';
import InfoArea from './../molokyler/info-area';
import MatchDetails from './../match-details'
import NotificationAlerts from './../notification-alerts';

import ServeOrder from '../molokyler/service-order-dialog';
import Timeout from '../timeout';
import  TimeoutButtons from '../timeout-buttons';

import AlertInfo from '../atom/alert-info';

import {
	PanelGroup,
	Panel
} from 'react-bootstrap'

import {
	MATCH,
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,
	AWAYTEAM_FIRST_PLAYER_NAME,
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,	
	FIRST_SET,
	SECOND_SET,
	THIRD_SET,
	AWAYTEAM_POINT,
	HOMETEAM_POINT,
	MATCH_IS_FINISED,
	ACTION_HISTORY
} from '../../domain/tide/state';

class Scoreboard extends Component {
	constructor(props) {
		super(props);
		this.state = {showDetails: false }
	}
	
	handleDetailToogle() {
		this.setState({showDetails: !this.state.showDetails })
	}

	render() {
		return (
			<div>
				<div className="container scoreboard">
					<div className="switch-modal">
						<NotificationAlerts
							message="Switch"
							eventTrigger="switch-notification" />
					</div>
					<div className="timeout-alerts">
						<Timeout
							seconds={45} message="Timeout: "
							eventTrigger="timeout-notification" />
					</div>
					<div className="timeout-alerts">
						<Timeout
							seconds={45} message="Technical time-out: "
							eventTrigger="tto-notification" />
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
									</tr>
								</thead>
								<tbody>
									<ScoreboardRow
										addPoint={this.props.tide.actions.all.addPointHometeam}
										score1={this.props[FIRST_SET][HOMETEAM_POINT]}
										score2={this.props[SECOND_SET][HOMETEAM_POINT]}
										score3={this.props[THIRD_SET][HOMETEAM_POINT]}
										player1={this.props[HOMETEAM_FIRST_PLAYER_NAME]}
										player2={this.props[HOMETEAM_SECOND_PLAYER_NAME]}
										teamColor={this.props[HOMETEAM_COLOR]}
										matchFinished={this.props[MATCH_IS_FINISED]} />
									<ScoreboardRow 
										addPoint={this.props.tide.actions.all.addPointAwayteam}
										score1={this.props[FIRST_SET][AWAYTEAM_POINT]}
										score2={this.props[SECOND_SET][AWAYTEAM_POINT]}
										score3={this.props[THIRD_SET][AWAYTEAM_POINT]}
										player1={this.props[AWAYTEAM_FIRST_PLAYER_NAME]}
										player2={this.props[AWAYTEAM_SECOND_PLAYER_NAME]}
										teamColor={this.props[AWAYTEAM_COLOR]}
										matchFinished={this.props[MATCH_IS_FINISED]} />
								</tbody>
							</table>
						</div>
						<div className="panel-footer">
							<TimeoutButtons />
						</div>
					</div>
					<section className="events">
						<MatchDetails 
							events={this.props[ACTION_HISTORY]}
							showDetails={this.state.showDetails}
							handleDetailToogle={this.handleDetailToogle.bind(this)}
						/>
					</section>
					
					<PanelGroup accordion={true}>
						<Panel header="Notes for first time users ⭢" eventKey="1">
							<InfoArea number={3}>
								You can set the service order by clicking the "Set service order" button above. (Optional)
							</InfoArea>
							<InfoArea number={4}>
						 		Now you kan keep score with the blue buttons right under "Add Point"
							</InfoArea>
							<AlertInfo message='If you do a mistake, you can adjust the score by also using the buttons below "remove point" to get the score right.' />
							<AlertInfo message="When you have set the service order, we will help you keep track of how is serving, It's almost magic." />
							<AlertInfo message='Want to start over or register a new match?  Click on the "new match button"!' />
							<AlertInfo message="You can not set the service order for a set after a points is given" />
							<AlertInfo message="For now it's not possible to change the score after a set or the match is finished."/>
							<AlertInfo message="If you need to use the remove points button the service order may be wrong afterwards! ."/>
						</Panel>
					</PanelGroup>
				</div>
			</div>
		);
	}
}

export default wrap(Scoreboard, {
	[HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
	[HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	[HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR],
	[AWAYTEAM_FIRST_PLAYER_NAME]: [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
	[AWAYTEAM_SECOND_PLAYER_NAME]: [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
	[AWAYTEAM_COLOR]: [MATCH, AWAYTEAM_COLOR],
	[FIRST_SET]: [MATCH, FIRST_SET],
	[SECOND_SET]: [MATCH, SECOND_SET], 
	[THIRD_SET]: [MATCH, THIRD_SET],
	[AWAYTEAM_POINT]: [MATCH, AWAYTEAM_POINT],
	[HOMETEAM_POINT]: [MATCH, HOMETEAM_POINT],
	[HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
	[HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	[HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR],
	[MATCH_IS_FINISED]: [MATCH, MATCH_IS_FINISED],
	[ACTION_HISTORY]: ACTION_HISTORY
});
