'use strict';

const React = require('react');
const Team = require('./../domain/Team');
const Button = require('react-bootstrap').Button;
const Well = require('react-bootstrap').Well;
const PlayerInput = require('./PlayerInput');

var AddAwayTeam = React.createClass({
  displayName() {
    return 'AddAwayTeam';
  },

  handleSubmit(e) {
    e.preventDefault();
    var player1 = document.getElementById('player1').value;
    var player2 = document.getElementById('player2').value;

    if (!player2) {
      document.getElementById('player2').focus();
      return;
    }

    this.props.match.addAwayTeam(new Team(player1, player2));

    this.props.changeState(
      {show: 'Scoreboard'}
    );
  },

  componentDidMount() {
    document.getElementById('player1').focus();
  },

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2>..and now the other team!</h2>
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
        <Well>
          <Button bsStyle="primary"> 2 </Button> Great! Now lets add the second team!
        </Well>
      </div>
    );
  }
});

module.exports = AddAwayTeam;
