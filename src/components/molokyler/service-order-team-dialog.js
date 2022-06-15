import React,{Component} from 'react';

import { 
	ButtonToolbar,
	Button,	
    Alert,
	ListGroupItem,
	ListGroup,
} from 'react-bootstrap';

import ServiceOrderDialog from '../templates/service-order-dialog'

import {
	wrap
} from 'tide'

import HomeTeam from './home-team';
import AwayTeam from './away-team';


import {
	constants as c
} from '../../domain/tide/state'

class ServeOrder extends Component {
	homeTeamStarts = () => {
		console.log('homeTeamStarts')
		this.props.tide.actions.all.teamToServe(c.HOMETEAM)
	}

	awayTeamStarts = () => {
		console.log('awayTeamStarts')
		this.props.tide.actions.all.teamToServe(c.AWAYTEAM)
	}

	render() {	
		return (
		<ServiceOrderDialog heading="Which team is serving first">
      		<ListGroup>
				<ListGroupItem onClick={this.homeTeamStarts}><HomeTeam /></ListGroupItem>
				<ListGroupItem onClick={this.awayTeamStarts}><AwayTeam /></ListGroupItem>
			</ListGroup>
    	</ServiceOrderDialog>
		)
	}
}

export default wrap(ServeOrder)