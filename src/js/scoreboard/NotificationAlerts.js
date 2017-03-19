'use strict';

import  React from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux'


const NotificationAlerts = React.createClass({

  getInitalState() {
    return { alertVisible: false}
  },

  hide() {
    this.setState({ alertVisible: false})
  },

  render() {
    return null;
    
    if(this.state.alertVisible) {
      setTimeout(() => this.hide(), 5000);
      return (
        <Alert bsStyle="info" onDismiss={this.hide}>
          <strong>{this.props.message}</strong>
        </Alert>
      )
    }
    return null;
  }
});

NotificationAlerts.contextTypes = {
  store: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    state: state
  }
}

const NotificationAlertsConnect = connect(
  mapStateToProps,
)(NotificationAlerts)

module.exports = NotificationAlertsConnect;
