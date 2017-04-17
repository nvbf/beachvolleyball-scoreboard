import  React, {Component} from 'react';
import { Alert } from 'react-bootstrap' 
import { wrap } from 'tide'
import { SWITCH_NOW } from '../../src/domain/tide/state'

class NotificationAlerts extends React.Component {
	hide() {
		this.setState({alertVisible: false});
	}

	render() {
		if (this.props.switch) {
			return (
				<Alert bsStyle="info" onDismiss={this.hide}>
					<strong>{this.props.message}</strong>
				</Alert>
			);
		}
		return null;
	}
};

export default wrap(NotificationAlerts,{
	[SWITCH_NOW]: SWITCH_NOW	
})
