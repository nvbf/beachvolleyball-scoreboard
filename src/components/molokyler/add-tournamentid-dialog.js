import React, { Component } from "react";
import { FormControl, Button } from "react-bootstrap";

import { wrap } from "tide";

import { constants as c } from "../../domain/tide/state";

import ServiceOrderDialog from "../templates/service-order-dialog";

import styled from "styled-components";

const StyledButton = styled(Button)`
    margin-top: 10px;
`;

class AddTournamentIdDialog extends Component {
  addTournamentId = () => {
    const tournamentId = document.getElementById("tournamentId").value;
    this.props.tide.actions.all.addTournamentId(tournamentId);
  };

  componentDidMount() {
    document.getElementById("tournamentId").value = this.props.tournamentId;
  }

  render() {
    return (
      <ServiceOrderDialog heading="Add your private Tournament id to show this on the public tournament site">
        <FormControl
          type="text"
          id="tournamentId"
          placeholder="Private tournament id"
        />
        <StyledButton bsStyle="primary" onClick={this.addTournamentId}>
          Add Tournament id
        </StyledButton>
      </ServiceOrderDialog>
    );
  }
}

export default wrap(AddTournamentIdDialog, {
  tournamentId: [c.MATCH, c.TOURNAMENT_PRIVATE_ID]
});
