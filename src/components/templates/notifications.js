import React,{Component} from 'react';
import { 
	Panel,
	Button
} from 'react-bootstrap';

import OkButton from '../molokyler/ok-button'

const NotificationsDialog = ({children, heading = "Notification"}) => {
	return (
		<div>
			
		<Panel header={heading} bsStyle="primary" footer={<OkButton />}>
			{children}
		</Panel>
		
		</div>
	)
}


export default NotificationsDialog