'use strict';
var React = require('react');
var   Alert = require('react-bootstrap').Alert;
var   AlertEventMixin = require('../mixin/AlertEventMixin');


var Timeout = React.createClass({

  mixins: [AlertEventMixin],

  propTypes: {
    seconds: React.PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      secondsLeft: this.props.seconds
    };
  },

  tick() {
    if (this.state.secondsLeft === -5) {
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
      <Alert bsStyle="info" onDismiss={this.handleAlertDismiss} isDismissable={true}>
        {this.props.message} {this.state.secondsLeft}
      </Alert>
    );
  }
});

module.exports = Timeout;
