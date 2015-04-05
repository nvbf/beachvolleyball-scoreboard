'use strict';

var React = require('react');

var AlertEventMixin = {

  propTypes: {
    eventTrigger: React.PropTypes.string.isRequired,
    notification: React.PropTypes.object.isRequired,
    message: React.PropTypes.string.isRequired
  },

  componentDidMount: function() {
    this.props.notification.on(this.props.eventTrigger, function() {
      this.setState({
        alertVisible: true
      });
    }.bind(this));
  },

  handleAlertDismiss: function() {
    this.replaceState(this.getInitialState());
    if (this.handleAlertDismissOverlay) {
      this.handleAlertDismissOverlay();
    }
  },

  getInitialState: function() {
    return {
      alertVisible: false
    };
  },

  render: function() {
    if (this.state.alertVisible) {
      return this.renderOverlay();
    } else {
      return <span/>
    }
  }
};

module.exports = AlertEventMixin;
