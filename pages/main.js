import React from 'react';
import url from 'url';
import {wrap} from 'tide'

import AddHomeTeam from './../src/components/components/add-home-team';
import AddAwayTeam from './../src/components/components/add-away-team';
import Scoreboard from './../src/components/components/scoreboard';

import {
	HOMETEAM_FIRST_PLAYER_NAME,
	HOMETEAM_SECOND_PLAYER_NAME,
	HOMETEAM_COLOR,

	AWAYTEAM_FIRST_PLAYER_NAME,
	AWAYTEAM_SECOND_PLAYER_NAME,
	AWAYTEAM_COLOR,
	
	SHOW_COMPONENT,
	ADD_AWAYTEAM_COMPONENT,
	ADD_HOMETEAM_COMPONENT,
	SCOREBOARD_COMPONENT,
	LOADING_COMPONENT
} from '../src/domain/tide/state';


const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Button = require('react-bootstrap').Button;

const MatchNotifications = require('./../src/domain/match-notifications');
const Match = require('./../src/domain/match');
const MatchApi = require('./../src/domain/match-api');
const Team = require('./../src/domain/team');

const match = new Match();
const matchApi = new MatchApi();

match.notification = new MatchNotifications(match, matchApi);

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			match: match.state,
			matchUrl: '',
			showTimeout: false,
			publicMatch: false
		};
	}

	changeState() {
		return function (state) {
			this.setState(
				state
      );
		}.bind(this);
	}

	showMatchUrl() {
		if (this.state.publicMatch) {
			const _this = this;
			if (!this.state.matchUrl) {
				matchApi.create(
					match,
					matchUrl => {
						_this.setState({matchUrl});
					}
        );
			}

			return (
				<p>
					{this.state.matchUrl}
				</p>
			);
		}
	}

	doMatchPublic(e) {
		e.preventDefault();
		this.setState({
			publicMatch: !this.state.publicMatch
		});
	}

	componentDidMount() {
		const qs = url.parse(document.location.search, true).query;
		
		if (qs.name1 && qs.name2 && qs.name3 && qs.name4) {

			this.props.tide.actions.all.mutateAndTrack(HOMETEAM_FIRST_PLAYER_NAME, qs.name1)
			this.props.tide.actions.all.mutateAndTrack(HOMETEAM_SECOND_PLAYER_NAME, qs.name2)
			this.props.tide.actions.all.mutateAndTrack(HOMETEAM_COLOR, qs.color1 ? `#${qs.color1}` : '#ff0000')
		
			this.props.tide.actions.all.mutateAndTrack(AWAYTEAM_FIRST_PLAYER_NAME, qs.name3)
			this.props.tide.actions.all.mutateAndTrack(AWAYTEAM_SECOND_PLAYER_NAME, qs.name4)
			this.props.tide.actions.all.mutateAndTrack(AWAYTEAM_COLOR, qs.color2 ? `#${qs.color2}` : '#0000ff')
			this.props.tide.actions.all.mutateAndTrack(SHOW_COMPONENT, SCOREBOARD_COMPONENT)
		} else {
			this.props.tide.actions.all.mutateAndTrack(SHOW_COMPONENT, ADD_HOMETEAM_COMPONENT)
		}
	}

	render() {
		const show = this.props[SHOW_COMPONENT]
		console.log('show:', show);
		const changeState = this.changeState();

		if (show === ADD_HOMETEAM_COMPONENT) {
			return (
				<main>
					<AddHomeTeam changeState={changeState} match={match}/>
				</main>
			);
		} else if (show === ADD_AWAYTEAM_COMPONENT) {
			return (
				<main>
					<AddAwayTeam changeState={changeState} match={match}/>
				</main>
			);
		} else if (show === LOADING_COMPONENT) {
			return (
				<main> Loading... </main>
			)
		}
		return (
			<section>
				<main>
					<Scoreboard match={match}/>
				</main>
			</section>
		);
	}
}


export default wrap(Main, {
	[HOMETEAM_FIRST_PLAYER_NAME]: HOMETEAM_FIRST_PLAYER_NAME,
	[HOMETEAM_SECOND_PLAYER_NAME]: HOMETEAM_SECOND_PLAYER_NAME,
	[HOMETEAM_COLOR]: HOMETEAM_COLOR,
	[AWAYTEAM_FIRST_PLAYER_NAME]: AWAYTEAM_FIRST_PLAYER_NAME,
	[AWAYTEAM_SECOND_PLAYER_NAME]: AWAYTEAM_SECOND_PLAYER_NAME,
	[AWAYTEAM_COLOR]: AWAYTEAM_COLOR,
	[SHOW_COMPONENT]: SHOW_COMPONENT,
	[ADD_AWAYTEAM_COMPONENT]: ADD_AWAYTEAM_COMPONENT,
	[ADD_HOMETEAM_COMPONENT]: ADD_HOMETEAM_COMPONENT,
	[SCOREBOARD_COMPONENT]: SCOREBOARD_COMPONENT
});