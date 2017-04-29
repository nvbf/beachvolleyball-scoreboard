import React, {Component} from 'react';
import {wrap} from 'tide'

import { 
	ButtonToolbar,
	Button,	
    Alert,
} from 'react-bootstrap';

import {
	PLAYER_TO_SERVE,
	SHOW_COMPONENT,
	SERVICE_ORDER_IS_SET,
	SHOW_SERVICE_ORDER_DIALOG_TEAM,
	SET_HAS_STARTED,
	MATCH,
} from '../../domain/tide/state'

export class ServiceOrderButton extends Component {

	showServiceOrderPicker = () =>  {
		this.props.tide.actions.all.mutateAndTrack([MATCH, SHOW_COMPONENT], SHOW_SERVICE_ORDER_DIALOG_TEAM)
	}

	render = () => {
		const {
			PLAYER_TO_SERVE,
			SERVICE_ORDER_IS_SET,
			SET_HAS_STARTED
		} = this.props;

		if (SERVICE_ORDER_IS_SET) {
			return (
				<section>
					<Alert bsStyle="warning">
						<p>Player to serve: {PLAYER_TO_SERVE} </p>
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
						className={ SET_HAS_STARTED ? "disabled": ""}>Set service order</Button>
					</ButtonToolbar>
				</Alert>
			</section>
		);
	}
}

// ServiceOrderButton
export default  wrap(ServiceOrderButton, {
	[PLAYER_TO_SERVE]: PLAYER_TO_SERVE,
	[SERVICE_ORDER_IS_SET]: SERVICE_ORDER_IS_SET,
	[SET_HAS_STARTED]: SET_HAS_STARTED
});
