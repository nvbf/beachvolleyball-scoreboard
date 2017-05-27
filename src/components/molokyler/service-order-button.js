import React, {Component} from 'react';
import {wrap} from 'tide'

import { 
	Button,	
} from 'react-bootstrap';

import {
	constants as c
} from '../../domain/tide/state'

export class ServiceOrderButton extends Component {

	showServiceOrderPicker =() => {
		this.props.tide.actions.all.mutateAndTrack([c.MATCH, c.SHOW_COMPONENT], c.SHOW_SERVICE_ORDER_DIALOG_TEAM)
	}

	render() {
		const {
			playerToServe,
			isServiceOrderSet
		} = this.props;

		if (isServiceOrderSet) {
			return (
				<p>Player to serve: {playerToServe} </p>
			);
		}

		return (
			<Button onClick={this.showServiceOrderPicker} >
				Set service order
			</Button>
		);
	}
}

// ServiceOrderButton
export default  wrap(ServiceOrderButton, {
	playerToServe: [c.MATCH, c.PLAYER_TO_SERVE],
	isServiceOrderSet: [c.MATCH, c.SERVICE_ORDER_IS_SET],
});
