import React from 'react'
import styled from 'styled-components';

import DetailToogle from './detail-toggle';
import { Alert } from 'react-bootstrap';

export default function MatchDetails({events, showDetails, handleDetailToogle}) {   
    const eventsComponent = events.map((event, index) => {
        return (<p key={index}>{event} </p>);
    });
    
    return (
        <Alert bsStyle="info">
            <h3 style={{display: "inline-flex"}} ></h3>
             <DetailToogle checked={showDetails}
                onChange={handleDetailToogle} /> 
             {eventsComponent.reverse()}
         </Alert>
    )
}