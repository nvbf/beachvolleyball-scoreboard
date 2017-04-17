import React, {Component} from 'react'
import { Button } from 'react-bootstrap' 
import styled from 'styled-components'

class Label2 extends Component{
    render() {
        const {
            number
        } =  this.props;
        return (
                <div>{number}</div>
        )
    }
}

export default styled.div`
        border-style: double;
        background-color: ${props => props.color || '#DDDDDD' };
        width: 1.5rem;
        height: 1.5rem;
        
`