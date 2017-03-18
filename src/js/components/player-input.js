'use strict';

const React = require('react');
const FormControl = require('react-bootstrap').FormControl;

const PlayerInput = React.createClass({
	render() {
		return (
      <div>
        <div className="form-group">
          <FormControl type="text" id="player1" className="form-control" placeholder="Player 1" />
        </div>
        <div className="form-group">
          <FormControl type="text" id="player2" className="form-control" placeholder="Player 2" />
        </div>
      </div>
		);
	}
})
;

module.exports = PlayerInput;
