'use strict';

var React = require('react');

var AlertEventMixin = {

  propTypes: {
    eventTrigger: React.PropTypes.string.isRequired,
    notification: React.PropTypes.object.isRequired,
    message: React.PropTypes.string.isRequired
  },

  componentDidMount() {
    this.props.notification.on(this.props.eventTrigger, function() {
      this.setState({
        alertVisible: true
      });
    }.bind(this));
  },

  handleAlertDismiss() {
    this.replaceState(this.getInitialState());
    if (this.handleAlertDismissOverlay) {
      this.handleAlertDismissOverlay();
    }
  },

  getInitialState() {
    return {
      alertVisible: false
    };
  },

  render() {

    if (this.state.alertVisible) {
      return this.renderOverlay();
    }
    return null;
  }
};

module.exports = AlertEventMixin;
