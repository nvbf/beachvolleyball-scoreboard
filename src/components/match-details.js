import React from "react";
import styled from "styled-components";

import DetailToogle from "./detail-toggle";
import { Alert } from "react-bootstrap";
import { getDetailsAsAnArrayOfString } from "./../domain/tide/logic";

import {
  MATCH,
  HOMETEAM_FIRST_PLAYER_NAME,
  HOMETEAM_SECOND_PLAYER_NAME,
  HOMETEAM_COLOR,
  AWAYTEAM_FIRST_PLAYER_NAME,
  AWAYTEAM_SECOND_PLAYER_NAME,
  AWAYTEAM_COLOR,
  FIRST_SET,
  SECOND_SET,
  THIRD_SET,
  AWAYTEAM_POINT,
  HOMETEAM_POINT,
  MATCH_IS_FINISED,
  ACTION_HISTORY,
  ACTION,
  VALUE,
  DATE,
  MATCHSTATE,
  UNDO,
  AWAYTEAM_TIMEOUT_TAKEN,
  HOMETEAM_TIMEOUT_TAKEN,
  constants as c
} from "../domain/tide/state";

export default function MatchDetails({
  events,
  showDetails,
  handleDetailToogle
}) {
  const details = getDetailsAsAnArrayOfString(events);
  const eventsComponent = details.map((detail, index) => (
    <p key={index}>{detail}</p>
  ));

  return (
    <Alert bsStyle="info">
      <h3 style={{ display: "inline-flex" }} />
      <DetailToogle checked={showDetails} onChange={handleDetailToogle} />
      {eventsComponent.reverse()}
    </Alert>
  );
}
