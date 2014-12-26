/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Team = require('./../domain/Team'),
  Button = require('react-bootstrap').Button,
  AddAwayTeam = React.createClass({
    displayName: function() {
      return 'AddAwayTeam';
    },

    handleSubmit: function(e) {
      e.preventDefault();
      var player1 = this.refs.player1.getDOMNode().value.trim(),
        player2 = this.refs.player2.getDOMNode().value.trim();

      if (!player2 || !player1) {
        console.error('Fyll inn navn');
        return;
      }
      this.props.match.addAwayTeam(new Team(player1, player2));

      this.props.changeState(
        {show: 'Scoreboard'}
      );
    },

    render: function() {
      return (
        <div className="addTeamContainer" >
          <div>
            <h2>Add Team</h2>
            <form className="add-team-form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" className="form-control" ref="player1"></input>
              </div>
              <div className="form-group">
                <input type="text" className="form-control" ref="player2"></input>
              </div>
              <Button type="submit" bsStyle="primary" className="pull-right">
                Add Team
              </Button>
            </form>
          </div>
        </div>
      );
    }
  });

module.exports = AddAwayTeam;
