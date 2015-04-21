'use strict';
const React = require('react');
const Button = require('react-bootstrap').Button;

var ScoreboardRow = React.createClass({

  propTypes: {
    team: React.PropTypes.object.isRequired,
    scoreForThisTeam: React.PropTypes.array.isRequired,
    pointsToTeam: React.PropTypes.func.isRequired
  },

  render() {
    var players = this.props.team;
    var score = this.props.scoreForThisTeam;

    return (
      <tr>
        <td>
          {players.player1} - {players.player2}
        </td>
        <td className='set'>
          {score[0]}
        </td>
        <td className='set'>
          {score[1]}
        </td>
        <td className='set'>
          {score[2]}
        </td>
        <td>
          <Button className="points btn-primary" type="submit" onClick={this.props.pointsToTeam}
                  disabled={this.props.match.state.finished}>
            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
          </Button>
        </td>
      </tr>
    )
  }
});

module.exports = ScoreboardRow;
