import React,{Component} from 'react';
import { 
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

class AddEmailDialog extends Component {
    addEmail = () => {
        const email = document.getElementById('email').value
        console.log('email', email)
        this.props.tide.actions.all.addEmail(email)
    }

	render() {
		return (
            <ServiceOrderDialog heading="Add email address">
                <FormControl
                    type="text"
                    id="email"
                    placeholder="Which emailaddresse should recive the match details when the match ends"
                />
                <StyledButton bsStyle="primary" onClick={this.addEmail}>
                    Add Email
                </StyledButton>
            </ServiceOrderDialog>
		)
	}
}


export default wrap(AddEmailDialog)