/** @jsx React.DOM  */
'use strict';

const React = require('react');
const  ListGroup = require('react-bootstrap/ListGroup');
const  ListGroupItem = require('react-bootstrap/ListGroupItem');

var ModalBodyList = React.createClass({
  displayName: function() {
    return 'ModalBodyList';
  },

  propTypes: {
    chosenFirstItem: React.PropTypes.func.isRequired,
    chosenSecondItem: React.PropTypes.func.isRequired,
    firstItemText: React.PropTypes.string.isRequired,
    secondItemText: React.PropTypes.string.isRequired,
    footerText: React.PropTypes.string
  },

  render: function() {
    return (
      <div className="modal-body">
        <ListGroup>
          <ListGroupItem onClick={this.props.chosenFirstItem}> {this.props.firstItemText} </ListGroupItem>
          <ListGroupItem onClick={this.props.chosenSecondItem}> {this.props.secondItemText} </ListGroupItem>
        </ListGroup>
        <div className="modal-footer">
          <p>{this.props.footerText}</p>
        </div>
      </div>
    )
  }
});

module.exports = ModalBodyList;
