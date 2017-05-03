import React,{Component} from 'react';

import {
	wrap
} from 'tide'

import { 
    Button,
    ButtonToolbar
} from 'react-bootstrap';

import {
	constants as c
} from '../../domain/tide/state'


class UndoButton extends Component {
	handlClick = () => {
        this.props.tide.actions.all.cancelSetServiceOrder()
	}

	render() {
		return (
        <div>
             <ButtonToolbar>
                <Button onClick={this.handlClick} className='pull-right' bsStyle="warning" >UNDO</Button>
             </ButtonToolbar>
        </div>
        )
	}
}

export default wrap(UndoButton)