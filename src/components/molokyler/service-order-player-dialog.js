import React,{Component} from 'react';
import { 
	Panel,
	ListGroupItem,
	ListGroup
} from 'react-bootstrap';

import {
	wrap
} from 'tide'

import ServiceOrderDialog from '../templates/service-order-dialog'

import {
	constants as c
} from '../../domain/tide/state'

import Player from '../atom/player'

export class ServeOrder extends Component	 {

	player1Starts = () => {
        const action = this.props.action;
		this.props.tide.actions.all[action](1)
	}

	player2Starts = () => {
        const action = this.props.action;
        this.props.tide.actions.all[action](2)
	}

	render() {
		const {
			player1,
            player2,
            color,
			team
		 } = this.props;
	
		return (
            <ServiceOrderDialog heading={`Which player is serving first on the ${team}`}>
                <ListGroup>
                    <ListGroupItem onClick={this.player1Starts}> <Player number={1} color={color} name={player1} /></ListGroupItem>
                    <ListGroupItem onClick={this.player2Starts}> <Player number={2} color={color} name={player2} /></ListGroupItem>
                </ListGroup>
            </ServiceOrderDialog>
		)
	}
}


export default wrap(ServeOrder)