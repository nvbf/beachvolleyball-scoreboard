/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  AlertEventMixin = require('../mixin/AlertEventMixin'),
  Alert = require('react-bootstrap/Alert');

var NotificationAlerts = React.createClass({

  propTypes: {
    message: React.PropTypes.string.isRequired
  },

  mixins: [AlertEventMixin],

  renderOverlay: function() {
    return (
      <Alert bsStyle="info" onDismiss={this.handleAlertDismiss} dismissAfter={5000}>
        <strong>{this.props.message}</strong>
      </Alert>
    )
  }
});

module.exports = NotificationAlerts;
