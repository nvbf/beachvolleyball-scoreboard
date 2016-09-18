import React from 'react';
const FormControl = require('react-bootstrap').FormControl;
const { updatePlayer } = require('./action-creator')


class PlayerInput extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    team: React.PropTypes.object.isRequired,
    teamKey: React.PropTypes.string.isRequired,
  }

  player1Changed = e => {
      const { store } = this.context;
      const { teamKey} = this.props;
      store.dispatch(updatePlayer(teamKey, "player1", e.target.value));
  }

  player2Changed = e => {
      const { store } = this.context;
      const { teamKey} = this.props;
      store.dispatch(updatePlayer(teamKey, "player2", e.target.value));
  }

  render() {

    const { team } = this.props;
    const players = team.get("players");
    const player1 = players.get("player1");
    const player2 = players.get("player2");
    return (
      <div>
        <div className="form-group">
          <FormControl onChange={this.player1Changed} value={player1} type="text" id='player1' placeholder="Player 1" />
        </div>
        <div className="form-group">
          <FormControl onChange={this.player2Changed} value={player2} type="text" id='player2' placeholder="Player 2" />
        </div>
      </div>
    )
  }
};

PlayerInput.contextTypes = {
  store: React.PropTypes.object
}

module.exports = PlayerInput;
