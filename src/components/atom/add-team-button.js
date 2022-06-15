import React from 'react';
import {Button} from 'react-bootstrap';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    margin-top: 1rem;
`;

export default function AddTeamButton({handleClick}) {
	return (
		<StyledButton onClick={handleClick} bsStyle="primary" className="pull-right">
            Add Team
        </StyledButton>
	);
}
