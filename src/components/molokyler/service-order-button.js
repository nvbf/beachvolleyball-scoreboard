import React, { Component } from "react";
import { wrap } from "tide";

import { Button } from "react-bootstrap";

import Label from "../atom/team-color-label";

import { constants as c } from "../../domain/tide/state";

export class ServiceOrderButton extends Component {
  showServiceOrderPicker = () => {
    this.props.tide.actions.all.mutateAndTrack(
      [c.MATCH, c.SHOW_COMPONENT],
      c.SHOW_SERVICE_ORDER_DIALOG_TEAM
    );
  };

  render() {
    const {
      playerToServe,
      isServiceOrderSet,
      hometeamColor,
      awayteamColor
    } = this.props;

    const player = playerToServe.name;
    //console.log('playerToServe', playerToServe)
    const color = playerToServe.team === c.HOMETEAM
      ? hometeamColor
      : awayteamColor;

    if (isServiceOrderSet) {
      return <h4>Player to serve: <Label color={color} /> {player}</h4>;
    }

    return (
      <Button onClick={this.showServiceOrderPicker}>
        Set service order
      </Button>
    );
  }
}

// ServiceOrderButton
export default wrap(ServiceOrderButton, {
  awayteamColor: [c.MATCH, c.AWAYTEAM_COLOR],
  hometeamColor: [c.MATCH, c.HOMETEAM_COLOR],
  playerToServe: [c.MATCH, c.PLAYER_TO_SERVE],
  isServiceOrderSet: [c.MATCH, c.SERVICE_ORDER_IS_SET]
});
