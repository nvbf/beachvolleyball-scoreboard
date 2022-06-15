import React, {Component} from 'react';
import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class AlertInfo extends Component {
	constructor() {
		super();
		this.state = {showInfo: true};
	}

	remove() {
		this.setState({showInfo: false});
	}

	render() {
		if (this.state.showInfo) {
			return (
				<Alert bsStyle="info" onDismiss={this.remove}>
					{this.props.message}
				</Alert>
			);
		}
		return null;
	}
}

AlertInfo.propTypes = {
	message: PropTypes.string.isRequired
};
