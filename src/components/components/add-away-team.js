import React, { Component } from "react";
import { Button, Well } from "react-bootstrap";
import styled from "styled-components";
import { wrap } from "tide";

import ColorPicker from "./../atom/color-picker";
import AddTeamButton from "./../atom/add-team-button";
import PlayerInput from "./../molokyler/player-input";
import InfoArea from "./../molokyler/info-area";

import {
  AWAYTEAM_FIRST_PLAYER_NAME,
  AWAYTEAM_SECOND_PLAYER_NAME,
  AWAYTEAM_COLOR,
  SHOW_COMPONENT,
  SCOREBOARD_COMPONENT,
  MATCH,
  constants as c
} from "../../domain/tide/state";

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 1rem;
`;

class AddAwayTeam extends Component {
  constructor(props) {
    super(props);
    const color = this.props.color || "#ff0000";
    this.state = { color };
  }

  handleColorPicker(colorObj) {
    this.setState({ color: colorObj.hex });
  }

  handleSubmit(e) {
    e.preventDefault();
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;

    if (!player2) {
      document.getElementById("player2").focus();
      return;
    }

    this.props.tide.actions.all.mutateAndTrack(
      [c.MATCH, c.AWAYTEAM_FIRST_PLAYER_NAME],
      player1
    );
    this.props.tide.actions.all.mutateAndTrack(
      [c.MATCH, c.AWAYTEAM_SECOND_PLAYER_NAME],
      player2
    );
    this.props.tide.actions.all.mutateAndTrack(
      [c.MATCH, c.AWAYTEAM_COLOR],
      this.state.color
    );
    this.props.tide.actions.all.mutate(
      [c.MATCH, c.SHOW_COMPONENT],
      c.SCOREBOARD_COMPONENT
    );
  }

  handleUndo = () => this.props.tide.actions.all.showAddHomeTeam();

  componentDidMount() {
    const color = this.props.color || "#ff0000";
    this.setState({ color });
    document.getElementById("player1").value = this.props.name1;
    document.getElementById("player2").value = this.props.name2;
    document.getElementById("player1").focus();
  }

  render() {
    const { name1, name2, color } = this.props;
    return (
      <div id="add-away-team">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2>Away team</h2>
          </div>
          <div className="panel-body">
            <PlayerInput />
            <ColorPicker
              color={this.state.color}
              onColorSelect={this.handleColorPicker.bind(this)}
            />
            <AddTeamButton handleClick={this.handleSubmit.bind(this)} />
            <StyledButton
              onClick={this.handleUndo}
              className="pull-right"
              bsStyle="warning"
            >
              Undo
            </StyledButton>
          </div>
        </div>
        <InfoArea number="ℹ">Great! Now lets add the second team!</InfoArea>
        <InfoArea number="ℹ">
          Pick and color for the team, or it will default to red.
        </InfoArea>
      </div>
    );
  }
}

export default wrap(AddAwayTeam, {
  name1: [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
  name2: [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
  color: [MATCH, AWAYTEAM_COLOR]
});
