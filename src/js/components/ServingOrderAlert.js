/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  ServingOrderAlert = require('./ServingOrderAlert');

ServingOrderAlert = React.createClass({
  displayName: function() {
    return 'ServingOrderAlert';
  },

  render: function() {
    return (
      <Alert bsStyle="warning">
        <strong>Set serve order?</strong>
      </Alert>
    )
  }
});

module.exports = ServingOrderAlert;
