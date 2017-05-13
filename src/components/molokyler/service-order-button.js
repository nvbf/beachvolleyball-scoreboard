import React, {Component} from 'react';
import {wrap} from 'tide'

import { 
	ButtonToolbar,
	Button,	
    Alert,
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
			isServiceOrderSet,
			hasSetStarted
		} = this.props;
		console.log('playerToServe', playerToServe);

		if (isServiceOrderSet) {
			return (
				<section>
					<Alert bsStyle="warning">
						<p>Player to serve: {playerToServe} </p>
					</Alert>
				</section>
			);
		}

		return (
			<section>
				<Alert bsStyle="warning">
					<ButtonToolbar>
						<Button 
						onClick={this.showServiceOrderPicker} 
						className={ hasSetStarted ? "disabled": ""}>Set service order</Button>
					</ButtonToolbar>
				</Alert>
			</section>
		);
	}
}

// ServiceOrderButton
export default  wrap(ServiceOrderButton, {
	playerToServe: [c.MATCH, c.PLAYER_TO_SERVE],
	isServiceOrderSet: [c.MATCH, c.SERVICE_ORDER_IS_SET],
	hasSetStarted: [c.MATCH, c.SET_HAS_STARTED]
});
