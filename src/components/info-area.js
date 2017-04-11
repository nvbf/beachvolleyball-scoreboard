import React from 'react';
import styled from 'styled-components';

import { 
    Button,
    Well
} from 'react-bootstrap';


const StyledButton = styled(Button)`
    margin-right: 1rem;
`

const InfoArea = ({number, children}) => {
    return (
        <Well>
            <StyledButton bsStyle="primary"> {number} </StyledButton>					
            {children}
        </Well>
    )
}

export default InfoArea