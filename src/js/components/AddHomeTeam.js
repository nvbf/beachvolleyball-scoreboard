'use strict';

const React = require('react');
const Team = require('./../domain/Team');
const Button = require('react-bootstrap').Button;
const PlayerInput = require('./PlayerInput');

var AddHomeTeam = React.createClass({
  displayName() {
    return 'AddHomeTeam';
  },

  handleSubmit(e) {
    e.preventDefault();
    var player1 = document.getElementById('player1').value;
    var player2 = document.getElementById('player2').value;

    if (!player2) {
      document.getElementById('player2').focus();
      return;
    }

    this.props.match.addHomeTeam(new Team(player1, player2));

    this.props.changeState(
      {show: 'AddAwayTeam'}
    );
  },

  componentDidMount() {
    document.getElementById('player1').focus();
  },

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>Add Home Team</h2>
        </div>
        <div className="panel-body">
          <form className="add-team-form" onSubmit={this.handleSubmit}>
            <PlayerInput />
            <Button type="submit" bsStyle="primary" className="pull-right">
              Add Team
            </Button>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = AddHomeTeam;
