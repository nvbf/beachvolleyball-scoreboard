'use strict';
var React = require('react');
var Alert = require('react-bootstrap').Alert;

var Timeout = React.createClass({

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

  render () {
    return (
      <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
        {this.props.message} {this.state.secondsLeft}
      </Alert>
    );
  }
});

module.exports = Timeout;
