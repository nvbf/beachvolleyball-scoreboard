'use strict';

const React = require('react');
const   Input = require('react-bootstrap/Input');

var PlayerInput = React.createClass({
  displayName: function() {
    return 'PlayerInput';
  },

  render: function() {
    return (
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
