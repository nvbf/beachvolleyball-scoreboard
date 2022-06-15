import React, { Component } from "react";
import { wrap } from "tide";

import { ButtonToolbar, Button, Alert } from "react-bootstrap";

import { constants as c } from "../../domain/tide/state";

export class AddCommentButton extends Component {
  showTournamentDialog = () => {
    this.props.tide.actions.all.mutate(
      [c.MATCH, c.SHOW_COMPONENT],
      c.SHOW_TOURNAMENT_COMPONENT
    );
  };

  render() {
    return (
      <Button onClick={this.showTournamentDialog}>
        Set TournamentId
      </Button>
    );
  }
}

export default wrap(AddCommentButton);
