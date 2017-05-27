import React,{Component} from 'react';
import { 
	FormGroup,
	ControlLabel,
	FormControl,
    Button
} from 'react-bootstrap';

import {
	wrap
} from 'tide'

import {
	constants as c
} from '../../domain/tide/state'

import ServiceOrderDialog from '../templates/service-order-dialog'

import styled from 'styled-components';

const StyledButton = styled(Button)`
    margin-top: 10px;
`;

export class AddCommentDialog extends Component	 {
    addComment = () => {
        const comment = document.getElementById('add-comments-textarea').value
        this.props.tide.actions.all.addComment(comment)
    }

	render() {
		return (
            <ServiceOrderDialog heading="Add Comments">
                <FormGroup controlId="add-comments-textarea">
                    <FormControl componentClass="textarea" placeholder="cards, how won the toos, and other remarks can be added here" />
                    <StyledButton bsStyle="primary" onClick={this.addComment}>
                        Add Comment
                    </StyledButton>
                </FormGroup>
            </ServiceOrderDialog>
		)
	}
}


export default wrap(AddCommentDialog)