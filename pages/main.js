import React from 'react';
import url from 'url';

import AddHomeTeam from './../src/components/add-home-team';
import AddAwayTeam from './../src/components/add-away-team';
import Scoreboard from './../src/components/scoreboard';

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
			show: 'AddHomeTeam',
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
			match.addHomeTeam(new Team(qs.name1, qs.name2));
			match.addAwayTeam(new Team(qs.name3, qs.name4));
			console.log('Setting show to Scoreboard');
			this.setState({show: 'Scoreboard'});
		}
	}

	render() {
		const show = this.state.show;
		const changeState = this.changeState();

		if (show === 'AddHomeTeam') {
			return (
				<main>
					<AddHomeTeam changeState={changeState} match={match}/>
				</main>
			);
		} else if (show === 'AddAwayTeam') {
			return (
				<main>
					<AddAwayTeam changeState={changeState} match={match}/>
				</main>
			);
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

module.exports = Main;
