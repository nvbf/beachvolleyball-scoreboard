import React from 'react';
import { Alert } from 'react-bootstrap';

class Timeout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: props.show,
			secondsLeft: this.props.seconds
		}
	}

	tick() {
		if (this.state.secondsLeft === -15) {
			this.handleAlertDismiss();
		} else {
			this.setState({secondsLeft: this.state.secondsLeft - 1});
			this.interval = setInterval(tick, 1000);
		}
	}

	handleAlertDismiss() {
		clearInterval(this.interval);
		this.state = { show: false }
	}

	render() {
		if(this.state.show) {
		return (
			<Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
				{this.props.message} {this.state.secondsLeft}
			</Alert>
		);
		}
		return null
	}
};

export default Timeout;
