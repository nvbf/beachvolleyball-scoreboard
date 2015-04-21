'use strict';

const React = require('react');
const  AlertEventMixin = require('../mixin/AlertEventMixin');
const  Alert = require('react-bootstrap').Alert;

var NotificationAlerts = React.createClass({

  mixins: [AlertEventMixin],

  renderOverlay() {
    return (
      <Alert bsStyle="info" onDismiss={this.handleAlertDismiss} dismissAfter={5000}>
        <strong>{this.props.message}</strong>
      </Alert>
    )
  }
});

module.exports = NotificationAlerts;
