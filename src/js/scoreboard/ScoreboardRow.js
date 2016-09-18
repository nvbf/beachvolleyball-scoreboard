import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'

const ScoreboardRow = React.createClass({
  propTypes: {
    team: React.PropTypes.string.isRequired,
  },

  render() {
    this.props.team;

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
      </tr>
    )
  }
});


ScoreboardRow.contextTypes = {
  store: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    awayteam: state.get(TEAM).get("awayteam")
  }
}

const ScoreboardRowConnect = connect(
  mapStateToProps,
)(ScoreboardRow)

export default ScoreboardRowConnect


module.exports = ScoreboardRow;
