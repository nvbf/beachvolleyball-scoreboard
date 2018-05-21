import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

export default class AlertInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { showInfo: true };
  }

  remove() {
    this.setState({ showInfo: false });
  }

  render() {
    if (this.state.showInfo) {
      return (
        <Alert bsStyle="info" onDismiss={this.remove}>
          {this.props.message}
        </Alert>
      );
    }
    return null;
  }
}

AlertInfo.propTypes = {
  message: PropTypes.string.isRequired
};
