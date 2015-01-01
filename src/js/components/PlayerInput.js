/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Input = require('react-bootstrap/Input'),
  PlayerInput;

PlayerInput = React.createClass({
  displayName: function() {
    return 'PlayerInput';
  },

  render: function() {
    return (//noinspection JSUnusedGlobalSymbols
      <div>
        <div className="form-group">
          <Input type="text" id='player1' className="form-control" placeholder="Player 1" />
        </div>
        <div className="form-group">
          <Input type="text" id='player2' className="form-control" placeholder="Player 2" />
        </div>
      </div>
    )
  }
})
;

module.exports = PlayerInput;
