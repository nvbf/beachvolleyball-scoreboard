const React = require('react');
const Alert = require('react-bootstrap').Alert;
const AlertEventMixin = require('../mixin/alert-event-mixin');

const NotificationAlerts = React.createClass({

	mixins: [AlertEventMixin],

	hide() {
		this.setState({alertVisible: false});
	},

	renderOverlay() {
		if (this.state.alertVisible) {
			setTimeout(() => this.hide(), 5000);
			return (
        <Alert bsStyle="info" onDismiss={this.hide}>
          <strong>{this.props.message}</strong>
        </Alert>
			);
		}
		return null;
	}
});

module.exports = NotificationAlerts;
