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

	addComment = () => {
		this.props.tide.actions.all.mutate([c.MATCH, c.SHOW_COMPONENT], c.SHOW_COMMENTS_DIALOG)
	}

	render() {
		return  <Button onClick={this.addComment}>Add Comment </Button>
	}
}


export default wrap(AddCommentButton);
