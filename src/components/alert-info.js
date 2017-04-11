const React = require('react');
const Alert = require('react-bootstrap').Alert;

const AlertInfo = React.createClass({
	propTypes: {
		message: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return {showInfo: true};
	},

	remove() {
		this.setState({showInfo: false});
	},

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
});

module.exports = AlertInfo;
