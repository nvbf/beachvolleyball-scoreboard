/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Navbar = require('react-bootstrap/Navbar'),
  Nav = require('react-bootstrap/Nav'),
  DropdownButton = require('react-bootstrap/DropdownButton'),
  MenuItem = require('react-bootstrap/MenuItem'),
  Menu;

Menu = React.createClass({
  displayName: function() {
    return 'Menu';
  },

  render: function() {
    return (
      <Navbar>
        <Nav>
          <MenuItem eventKey="1">Serving Order</MenuItem>
          <MenuItem eventKey="2">Logg inn</MenuItem>
        </Nav>
      </Navbar>
    )
  }
});

module.exports = Menu;
