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

export class AddCommentButton extends Component {

	showEmailDialog = () => {
		this.props.tide.actions.all.mutate([c.MATCH, c.SHOW_COMPONENT], c.SHOW_EMAIL_DIALOG)
	}

	render() {
		return  <Button onClick={this.showEmailDialog}>Set email addresse (to get mail when match is over)</Button>
	}
}


export default wrap(AddCommentButton);
