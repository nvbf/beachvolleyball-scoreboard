import React,{Component} from 'react';

import {
	constants as c
} from '../../domain/tide/state'

import {
	wrap
} from 'tide'


import { 
    Button,
    ButtonToolbar
} from 'react-bootstrap';


class BasicButton extends Component {
	handlClick = () => {
		this.props.tide.actions.all.mutate([c.MATCH, c.SHOW_COMPONENT], c.SCOREBOARD_COMPONENT)
	}

	render() {
        const {
            children
        } = this.props;

		return (
        <div>
             <ButtonToolbar>
                <Button onClick={this.handlClick} {...this.props} >{children}</Button>
             </ButtonToolbar>
        </div>
        )
	}
}

export default wrap(BasicButton)