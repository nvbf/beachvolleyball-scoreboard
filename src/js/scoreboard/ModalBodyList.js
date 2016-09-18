'use strict';

import React from 'react';
const  ListGroup = require('react-bootstrap').ListGroup;
const  ListGroupItem = require('react-bootstrap').ListGroupItem;
const Modal = require('react-bootstrap').Modal;

var ModalBodyList = React.createClass({

  propTypes: {
    chosenFirstItem: React.PropTypes.func.isRequired,
    chosenSecondItem: React.PropTypes.func.isRequired,
    firstItemText: React.PropTypes.string.isRequired,
    secondItemText: React.PropTypes.string.isRequired,
    footerText: React.PropTypes.string,
    firstDisabled: React.PropTypes.bool,
    secondDisabled: React.PropTypes.bool
  },

  render() {
    return (
      <div>
      <Modal.Header closeButton>
        <Modal.Title>Service Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroupItem onClick={this.props.chosenFirstItem}> {this.props.firstItemText} </ListGroupItem>
          <ListGroupItem onClick={this.props.chosenSecondItem}> {this.props.secondItemText} </ListGroupItem>
        </ListGroup>
        <div className="modal-footer">
          <p>{this.props.footerText}</p>
        </div>
      </Modal.Body>
      </div>
    )
  }
});

module.exports = ModalBodyList;
