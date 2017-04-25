import React,{Component} from 'react';
import { 
	ButtonToolbar,
	Button,	
    Alert,
	Panel
} from 'react-bootstrap';

import {wrap} from 'tide'


import ModalBodyList from '../modal-body-list';

import {
	PLAYER_TO_SERVE,
	HOMETEAM,
	AWAYTEAM,
	FIRST_TEAM_TO_SERVE,
	SERVICE_ORDER_IS_SET,
	SHOW_COMPONENT
} from '../../domain/tide/state'

export class ServeOrder extends Component	 {

	awayTeamStarts() {
		this.props.tide.actions.all.mutateAndTrack(FIRST_TEAM_TO_SERVE, AWAYTEAM)
	}

	homeTeamStarts() {
		this.props.tide.actions.all.mutateAndTrack(FIRST_TEAM_TO_SERVE, HOMETEAM)
	}

	render() {
		const {
			PLAYER_TO_SERVE,
			SHOW_COMPONENT
		 } = this.props;
		
	}

	chosenPlayer(names) {
		return function () {
			const order = this.state.order;
			const state = {};
			state.order = order;

			if (order.length === 2) {
				order.splice(1, 0, names[0]);
				order.push(names[1]);
			} else {
				order.push(names[0]);
				order.push(names[1]);
			}
			if (order.length === 4) {
				state.isModalOpen = false;
				state.servingOrder = new ServingOrder(order);

				const orderOfServer = state.servingOrder.getServiceOrder().slice();
				orderOfServer.reverse().forEach((server, i) => {
					this.props.match.addEvent(4 - i + '. ' + server);
				});
				this.props.match.addEvent('Service Order');
			}

			this.setState(state);
		}.bind(this);
	}

	render() {
		return (
		<Panel header="Service Order" bsStyle="primary">
      		Panel content
    	</Panel>
		)
		/*if (!this.state.isModalOpen) {
			return null;
		}
		if ((this.state.startToServe === 'hometeam' && this.state.order.length === 0) ||
      (this.state.startToServe === 'awayteam' && this.state.order.length === 2)) {
			modalBodyList = getPlayerModalBodyList(
				homeTeam,
				this.props.match.homeTeamColor(),
				this.chosenPlayer([homeTeam.player1, homeTeam.player2]),
				this.chosenPlayer([homeTeam.player2, homeTeam.player1])
      );
		} else if ((this.state.startToServe === 'awayteam' && this.state.order.length === 0) ||
      (this.state.startToServe === 'hometeam' && this.state.order.length === 2)) {
			modalBodyList = getPlayerModalBodyList(
				awayTeam,
				this.props.match.awayTeamColor(),
				this.chosenPlayer([awayTeam.player1, awayTeam.player2]),
				this.chosenPlayer([awayTeam.player2, awayTeam.player1])
      );
		} else {
			modalBodyList = getTeamModalBodyList(this.props.match, this.homeTeamStarts, this.awayTeamStarts);
		}
		return (

			<div>
					{modalBodyList}
			</div>
		);*/
	}
}

function getTeamModalBodyList(match, homeTeamStarts, awayTeamStarts) {
	const homeTeam = match.homeTeam();
	const awayTeam = match.awayTeam();
	const homeTeamText = homeTeam.player1 + '-' + homeTeam.player2;
	const awayTeamText = awayTeam.player1 + '-' + awayTeam.player2;

	return (
		<ModalBodyList 
			chosenFirstItem={homeTeamStarts}
			chosenSecondItem={awayTeamStarts} 
			firstItemText={homeTeamText}
			secondItemText={awayTeamText} 
			firstColor={match.homeTeamColor()}
			secondColor={match.awayTeamColor()}
			footerText="Choose the team that will start serving" 

		/>
	);
}

function getPlayerModalBodyList(team, color, chosenFirstItem, chosenSecondItem) {
	return <ModalBodyList
		chosenFirstItem={chosenFirstItem}
		chosenSecondItem={chosenSecondItem}
		firstItemText={team.player1}
		secondItemText={team.player2}
		firstColor={color}
		secondColor={color}
		footerText="Choose the player that will start serving" 
		showNumber={true}
		/>
}


export default wrap(ServeOrder, {
	PLAYER_TO_SERVE,
	SERVICE_ORDER_IS_SET,
	SHOW_COMPONENT

});
