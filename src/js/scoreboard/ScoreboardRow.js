import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { TEAM } from './../constants';

const ScoreboardRow = React.createClass({
  propTypes: {
    players: React.PropTypes.object.isRequired,
  },

  onClick() {
    console.log('TODO: Add point');
  },

  render() {
    const player1 = this.props.players.get('player1');
    const player2 = this.props.players.get('player2');

    var score = [0,0,0];

    return (
      <tr>
        <td>
          {player1} - {player2}
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
          <Button bsStyle="primary" className="points" type="submit" onClick={this.onClick}
                  disabled={false}>
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
    awayteam: state[TEAM].get("awayteam")
  }
}

const ScoreboardRowConnect = connect(
  mapStateToProps,
)(ScoreboardRow)

export default ScoreboardRowConnect;
