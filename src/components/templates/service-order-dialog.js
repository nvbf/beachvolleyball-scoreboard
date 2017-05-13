import React, {Component} from 'react';
import {
	Panel,
	Button
} from 'react-bootstrap';

import UndoButton from '../molokyler/undo-button';

const ServiceOrderDialog = ({children, heading = 'Service Order'}) => {
	return (
		<div>

			<Panel header={heading} bsStyle="primary" footer={<UndoButton/>}>
				{children}
			</Panel>

		</div>
	);
};

export default ServiceOrderDialog;
