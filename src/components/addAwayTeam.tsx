import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { CirclePicker } from "react-color";
import { useAppSelector, useAppDispatch } from '../store/store'
import {
  VolleyCard, VolleyCardHeader, VolleyStack, VolleyFormControl, ShirtColors,
  RightBox, VolleyAlert
} from "../util/styles"
import { addAwayTeam } from '../store/teams/actions';

export function AddAwayTeam() {
  const team = useAppSelector(state => state.team.awayTeam)
  const dispatch = useAppDispatch()

  const [shirtColor, setShirtColor] = useState(team.shirtColor);
  const [showPicker, setShowPicker] = useState(false);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  function handleChangeComplete(color?: any) {
    setShirtColor(color.hex)
    setShowPicker(false);
  };

  function handlePlayer1Name(name: string) {
    setPlayer1Name(name)
  }

  function handlePlayer2Name(name: string) {
    setPlayer2Name(name)
  }

  function handleClick() {
    setShowPicker(!showPicker);
  }

  function handleSubmit() {
    dispatch(addAwayTeam({
      player1Name: player1Name,
      player2Name: player2Name,
      shirtColor: shirtColor,
      added: true
    }))
  }

  return (
    <Box >
      <VolleyCard >
        <VolleyCardHeader
          title="Away team"
        />
        <VolleyStack spacing={2}>
          <VolleyFormControl fullWidth>
            <TextField id="player1" label="Player 1" variant="standard" onChange={(e) => handlePlayer1Name(e.target.value)} />
            <VolleyFormControl fullWidth>
            </VolleyFormControl>
            <TextField id="player2" label="Player 2" variant="standard" onChange={(e) => handlePlayer2Name(e.target.value)} />
          </VolleyFormControl>
          <Button sx={{
            backgroundColor: shirtColor, "&.MuiButtonBase-root:hover": {
              bgcolor: shirtColor
            }
          }} onClick={handleClick} variant="contained" fullWidth>Pick shirt color</Button>
          {showPicker && <CirclePicker
            colors={ShirtColors}
            width="100%"
            color={shirtColor}
            onChangeComplete={handleChangeComplete}
          />}
          <RightBox sx={{ float: "right" }}><Button onClick={handleSubmit} variant="contained" >Add team</Button></RightBox>
        </VolleyStack>
      </VolleyCard>

      <VolleyAlert severity="info">
        Great! Now lets add the second team!
      </VolleyAlert>
      <VolleyAlert severity="info">
        Pick a color for the team, or it will default to red.
      </VolleyAlert>
    </Box>
  );
}

export default AddAwayTeam;
