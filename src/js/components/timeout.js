'use strict';
const React = require('react');
const Alert = require('react-bootstrap').Alert;
const AlertEventMixin = require('../mixin/alert-event-mixin');

const Timeout = React.createClass({

	mixins: [AlertEventMixin],

	propTypes: {
		seconds: React.PropTypes.number.isRequired,
		message: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {
			secondsLeft: this.props.seconds
		};
	},

	tick() {
		if (this.state.secondsLeft === -15) {
			this.handleAlertDismiss();
		} else {
			this.setState({secondsLeft: this.state.secondsLeft - 1});
		}
	},

	componentDidMount() {
		this.props.notification.on(this.props.eventTrigger, () => {
			if (!this.state.interval) {
				this.interval = setInterval(this.tick, 1000);
				this.setState({
					interval: true
				});
			}
		});
	},

	handleAlertDismissOverlay() {
		clearInterval(this.interval);
	},

	renderOverlay() {
		return (
      <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
        {this.props.message} {this.state.secondsLeft}
      </Alert>
		);
	}
});

module.exports = Timeout;
