import React, {Component} from 'react';
import {Alert} from 'react-bootstrap';
import {wrap} from 'tide';

export default class NotificationAlerts extends React.Component {
	constructor(props) {
		super(props);
	}

	hide() {
		this.setState({show: false});
	}

	render() {
		if (this.props.show && this.state.show) {
			return (
				<Alert bsStyle="info" onDismiss={this.hide}>
					<strong>{this.props.message}</strong>
				</Alert>
			);
		}
		return null;
	}
}
