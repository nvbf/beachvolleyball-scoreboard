/** @jsx React.DOM  */
'use strict';

const React = require('react');


var Menu = React.createClass({
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
