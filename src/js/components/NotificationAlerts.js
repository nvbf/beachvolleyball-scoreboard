'use strict';

const React = require('react');
const Alert = require('react-bootstrap').Alert;
const  AlertEventMixin = require('../mixin/AlertEventMixin');

const NotificationAlerts = React.createClass({

  mixins: [AlertEventMixin],

  renderOverlay() {
    if(this.state.alertVisible) {
      return (
        <Alert bsStyle="info" onDismiss={this.hide}>
          <strong>{this.props.message}</strong>
        </Alert>
      )
    }
    return null;
  }
});

module.exports = NotificationAlerts;
