import React from 'react';
import { Button, Well } from 'react-bootstrap'
//import { push } from 'react-router-redux'
import { Link } from 'react-router'

import { addTeam } from './action-creator'
import PlayerInput from './PlayerInput';
import { TEAM } from './../constants'
import { connect } from 'react-redux'


class AddHomeTeam extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.getElementById('player1').focus();
  }

  render() {
    const team = this.props.hometeam;
    return (
      <div>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2>Lets add the first team..</h2>
        </div>
        <div className="panel-body">
            <PlayerInput team={team} teamKey="hometeam" />
            <Link to="/add/team/2">Add Team</Link>
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

AddHomeTeam.contextTypes = {
  store: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    hometeam: state.get(TEAM).get("hometeam")
  }
}

const AddHomeTeamConnect = connect(
  mapStateToProps,
)(AddHomeTeam)

export default AddHomeTeamConnect
