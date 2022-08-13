import React, {Component, useState} from 'react';
import {wrap} from 'tide'

import {
  ButtonToolbar,
  Button,
  Alert,
  Modal
} from 'react-bootstrap';

import {
  AWAYTEAM_COLOR,
  constants as c, HOMETEAM_COLOR, HOMETEAM_POINT, MATCH, THIRD_SET
} from '../../domain/tide/state'
import HomeTeam from "./home-team";
import AwayTeam from "./away-team";
import {ColorPicker} from "../atom/color-picker";

export const SetTeamColorsButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCloseDialog = () => {
    setShowDialog(false);
  }

  return <>
    <Button onClick={() => setShowDialog(true)}>Set team colors</Button>
    <SetTeamColorsDialog show={showDialog}
                         handleCloseDialog={handleCloseDialog} />
  </>
}

const SetTeamColorsDialog = wrap(({show, handleCloseDialog, homeTeamColor, awayTeamColor, tide}) => {
  const handleSelectColor = (teamColor) => (color) => {
    console.log('The team color', color);
    tide.actions.all.mutateAndTrack([MATCH, teamColor], color.hex)
  }
  console.log('Home team color', homeTeamColor);
  return <Modal show={show} onHide={handleCloseDialog}>
    <Modal.Header closeButton>
      <Modal.Title>Set team colors</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4><HomeTeam/></h4>
      <ColorPicker color={homeTeamColor} onChangeComplete={handleSelectColor(HOMETEAM_COLOR)}/>
      <h4><AwayTeam/></h4>
      <ColorPicker color={awayTeamColor} onChangeComplete={handleSelectColor(AWAYTEAM_COLOR)}/>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={handleCloseDialog}>Close</Button>
    </Modal.Footer>
  </Modal>
}, {
  homeTeamColor: [MATCH, HOMETEAM_COLOR],
  awayTeamColor: [MATCH, AWAYTEAM_COLOR],
});


export default wrap(SetTeamColorsButton);
