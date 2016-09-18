import React from 'react';
import { Button, Well } from 'react-bootstrap'
//import { push } from 'react-router-redux'
import { Link } from 'react-router'

import { addTeam } from './action-creator'
import PlayerInput from './PlayerInput';
import { TEAM } from './../constants'
import { connect } from 'react-redux'


class AddAwayTeam extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.getElementById('player1').focus();
  }

  render() {
    const team = this.props.awayteam;
    return (
      <div>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>Great, lets add the second team also</h2>
        </div>
        <div className="panel-body">
            <PlayerInput team={team} teamKey="awayteam" />
            <Link to="/scoreboard">Add Team</Link>
        </div>
      </div>

      <Well>
        TODOS:<br/>
         1.Change the adding of teams, so that you can add a player. <br/>
         A player should have firstname, lastname, and number on shirt<br/><br/>
         2. The team has a color on the shirt, make that customisable
      </Well>

      </div>
    )
  }
};

AddAwayTeam.contextTypes = {
  store: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    awayteam: state.get(TEAM).get("awayteam")
  }
}

const AddAwayTeamConnect = connect(
  mapStateToProps,
)(AddAwayTeam)

export default AddAwayTeamConnect
