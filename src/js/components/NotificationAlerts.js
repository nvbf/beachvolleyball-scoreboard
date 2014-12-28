/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Alert  = require('react-bootstrap').Alert;

var NotificationAlerts = React.createClass({

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

  getInitialState: function() {
    return {
      alertVisible: false
    };
  },

  handleAlertDismiss: function() {
    this.setState({alertVisible: false});
  },

  render: function() {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss} dismissAfter={5000}>
          <strong>      {this.props.message}</strong>
        </Alert>
      )
    } else {
       return <span/>
    }
  }
});

module.exports = NotificationAlerts;
