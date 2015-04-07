'use strict';
var React = require('react');
var   Alert = require('react-bootstrap').Alert;
var   AlertEventMixin = require('../mixin/AlertEventMixin');


var Timeout = React.createClass({

  mixins: [AlertEventMixin],

  propTypes: {
    seconds: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      secondsLeft: this.props.seconds
    };
  },

  tick: function() {
    if (this.state.secondsLeft === -5) {
      this.handleAlertDismiss();
    } else {
      this.setState({secondsLeft: this.state.secondsLeft - 1});
    }
  },

  componentDidMount: function() {
    this.props.notification.on(this.props.eventTrigger, function() {
      if (!this.state.interval) {
        this.interval = setInterval(this.tick, 1000);
        this.setState({
          interval: true
        });
      }
    }.bind(this));
  },

  handleAlertDismissOverlay: function() {
    clearInterval(this.interval);
  },

  renderOverlay: function() {
    return (
      <Alert bsStyle="info" onDismiss={this.handleAlertDismiss} isDismissable={true}>
        {this.props.message} {this.state.secondsLeft}
      </Alert>
    );
  }
});

module.exports = Timeout;
