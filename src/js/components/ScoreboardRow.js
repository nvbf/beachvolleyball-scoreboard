'use strict';
const React = require('react');
const Button = require('react-bootstrap').Button;

var ScoreboardRow = React.createClass({

  propTypes: {
    team: React.PropTypes.object.isRequired,
    scoreForThisTeam: React.PropTypes.array.isRequired,
    pointsToTeam: React.PropTypes.func.isRequired,
    removePoint: React.PropTypes.func.isRequired
  },

  render() {
    var players = this.props.team;
    var score = this.props.scoreForThisTeam;

    return (
      <tr>
        <td>
          {players.player1} - {players.player2}
        </td>
        <td>
          {score[0]}
        </td>
        <td>
          {score[1]}
        </td>
        <td>
          {score[2]}
        </td>
        <td>
          <Button bsStyle="primary" className="points" type="submit" onClick={this.props.pointsToTeam}
                  disabled={this.props.match.state.finished}>
            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
          </Button>
        </td>
        <td>
          <Button bsStyle="warning" className="points" type="submit" onClick={this.props.removePoint}
                  disabled={this.props.match.state.finished}>
            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
          </Button>
        </td>
      </tr>
    )
  }
});

module.exports = ScoreboardRow;
