/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Team = require('./../domain/Team'),
  Button = require('react-bootstrap').Button,
  Input = require('react-bootstrap').Input,
  AddAwayTeam = React.createClass({
    displayName: function() {
      return 'AddAwayTeam';
    },

    handleSubmit: function(e) {
      e.preventDefault();
      var player1 = this.refs.player1.getValue(),
        player2 = this.refs.player2.getValue();
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
        <div className="panel panel-default" >
        <div className="panel-heading"><h2>Add Away Team</h2></div>
          <div className="panel-body">
            <form className="add-team-form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <Input type="text" className="form-control" ref="player1" placeholder="Player 1" />
              </div>
              <div className="form-group">
                <Input type="text" className="form-control" ref="player2" placeholder="Player 2" />
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
