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
	
	MATCH,
	SHOW_COMPONENT,
	ADD_AWAYTEAM_COMPONENT,
	ADD_HOMETEAM_COMPONENT,
	SCOREBOARD_COMPONENT,
	LOADING_COMPONENT
} from '../src/domain/tide/state';

import {
  get as getStateFromLocalStorage
} from './../src/domain/tide/storage';


import {
	ButtonToolbar,
	Button
} from 'react-bootstrap';


class Main extends React.Component {
	componentDidMount() {
		const qs = url.parse(document.location.search, true).query;
		const state = getStateFromLocalStorage(qs.id)
		
		if (qs.name1 && qs.name2 && qs.name3 && qs.name4) {
			if(state !== false) {
				if(
					state[MATCH][HOMETEAM_FIRST_PLAYER_NAME] === qs.name1 &&
					state[MATCH][HOMETEAM_SECOND_PLAYER_NAME] === qs.name2 &&
					state[MATCH][AWAYTEAM_FIRST_PLAYER_NAME] === qs.name3 &&
					state[MATCH][AWAYTEAM_SECOND_PLAYER_NAME] === qs.name4
				) {
					this.props.tide.actions.all.load(state)
					return;
				} else {
					this.props.tide.actions.all.mutateAndTrack([MATCH, SHOW_COMPONENT], ADD_HOMETEAM_COMPONENT)
					return;
				}

			}
				this.props.tide.actions.all.mutateAndTrack([MATCH, HOMETEAM_FIRST_PLAYER_NAME], qs.name1)
				this.props.tide.actions.all.mutateAndTrack([MATCH, HOMETEAM_SECOND_PLAYER_NAME], qs.name2)
				this.props.tide.actions.all.mutateAndTrack([MATCH, HOMETEAM_COLOR], qs.color1 ? `#${qs.color1}` : '#ff0000')
			
				this.props.tide.actions.all.mutateAndTrack([MATCH, AWAYTEAM_FIRST_PLAYER_NAME], qs.name3)
				this.props.tide.actions.all.mutateAndTrack([MATCH, AWAYTEAM_SECOND_PLAYER_NAME], qs.name4)
				this.props.tide.actions.all.mutateAndTrack([MATCH, AWAYTEAM_COLOR], qs.color2 ? `#${qs.color2}` : '#0000ff')
				this.props.tide.actions.all.mutateAndTrack([MATCH, SHOW_COMPONENT], SCOREBOARD_COMPONENT)
		} else {
			if(state !== false) {
				this.props.tide.actions.all.load(state)
				return;
			}
			this.props.tide.actions.all.mutateAndTrack([MATCH, SHOW_COMPONENT], ADD_HOMETEAM_COMPONENT)
		}
	}

	render() {
		const show = this.props[SHOW_COMPONENT]
		console.log('show:', show);

		if (show === ADD_HOMETEAM_COMPONENT) {
			return (
				<main>
					<AddHomeTeam/>
				</main>
			);
		} else if (show === ADD_AWAYTEAM_COMPONENT) {
			return (
				<main>
					<AddAwayTeam />
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
					<Scoreboard/>
				</main>
			</section>
		);
	}
}


export default wrap(Main, {
	[HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
	[HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
	[HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR],
	[AWAYTEAM_FIRST_PLAYER_NAME]: [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
	[AWAYTEAM_SECOND_PLAYER_NAME]: [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
	[AWAYTEAM_COLOR]: [MATCH, AWAYTEAM_COLOR],
	[SHOW_COMPONENT]: [MATCH, SHOW_COMPONENT],
	[ADD_AWAYTEAM_COMPONENT]: [MATCH, ADD_AWAYTEAM_COMPONENT],
	[ADD_HOMETEAM_COMPONENT]: [MATCH, ADD_HOMETEAM_COMPONENT],
	[SCOREBOARD_COMPONENT]: [MATCH, SCOREBOARD_COMPONENT],
});