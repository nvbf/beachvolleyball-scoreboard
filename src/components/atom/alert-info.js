import React,{Component} from 'react';
import Alert from 'react-bootstrap';

export default class AlertInfo extends Component {
	getInitialState() {
		return {showInfo: true};
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
		message: React.PropTypes.string.isRequired
}
