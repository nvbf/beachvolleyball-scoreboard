import React, {Component} from 'react';
import {wrap} from 'tide';

import ScoreboardRow from '../molokyler/scoreboard-row';
import ServiceOrderButton from './../molokyler/service-order-button';
import AddCommentButton from './../molokyler/add-comments-button';
import InfoArea from './../molokyler/info-area';
import MatchDetails from './../match-details';

import Timeout from '../timeout';
import TimeoutButtons from '../timeout-buttons';
import AwayTeam from '../molokyler/away-team';
import HomeTeam from '../molokyler/home-team';
import AddEmailButton from '../molokyler/add-email-button';

import AlertInfo from '../atom/alert-info';

import {
	Button,
	ButtonToolbar,
	Alert,
	PanelGroup,
	Panel
} from 'react-bootstrap';

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
		this.state = {showDetails: false};
	}

	handleDetailToogle() {
		this.setState({showDetails: !this.state.showDetails});
	}

	
	render() {
		console.log('rendering scoreboard', this.props);
		this.props
		const newMatchUrl = "/match?id=" + (new Date().toDateString() + Math.floor((Math.random() * 10000)));
		
		return (
			<div>
				<div className="container scoreboard">
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
										TeamComponent={HomeTeam}
										matchFinished={this.props[MATCH_IS_FINISED]}
										/>
									<ScoreboardRow
										addPoint={this.props.tide.actions.all.addPointAwayteam}
										score1={this.props[FIRST_SET][AWAYTEAM_POINT]}
										score2={this.props[SECOND_SET][AWAYTEAM_POINT]}
										score3={this.props[THIRD_SET][AWAYTEAM_POINT]}
										TeamComponent={AwayTeam}
										matchFinished={this.props[MATCH_IS_FINISED]}
										/>
								</tbody>
							</table>
						</div>
						<div className="panel-footer">
							<TimeoutButtons/>
						</div>
					</div>
					<section>
						<Alert bsStyle="warning">
							<ButtonToolbar>
								<ServiceOrderButton/>
								<AddCommentButton />
							</ButtonToolbar>
						</Alert>
					</section>

					<PanelGroup accordion>
						<Panel header="Details ⭢" eventKey="1">
							<MatchDetails
								events={this.props[ACTION_HISTORY]}
								showDetails={this.state.showDetails}
								handleDetailToogle={this.handleDetailToogle.bind(this)}
								/>
						</Panel>		
						<Panel header="Settings ⭢" eventKey="2">
							<a href={newMatchUrl}>New match</a>
							<AddEmailButton />
						</Panel>	
						<Panel header="Notes for first time users ⭢" eventKey="3">
							<InfoArea number={'?'}>
								This scoreboard should be so easy to use and help you in all the parts of the scoreboard
								process so that it's no need for more people then the referee
							</InfoArea>
							<InfoArea number={'?'}>
								You can set the service order by clicking the "Set service order" button above. (Optional)
								When you have set the service order, we will help you keep track of how is serving.
							</InfoArea>
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
	[HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
	[HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	[HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR],
	[MATCH_IS_FINISED]: [MATCH, MATCH_IS_FINISED],
	[ACTION_HISTORY]: ACTION_HISTORY
});
