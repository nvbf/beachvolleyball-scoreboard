/** @jsx React.DOM  */
'use strict';

var React = require('react'),
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
