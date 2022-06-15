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
import { addHomeTeam } from '../store/match/actions';

export function AddHomeTeam() {
  const team = useAppSelector(state => state.match.homeTeam)
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
    dispatch(addHomeTeam({
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
          title="Home team"
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
        The first thing we need to do is to add the name of the players to the home team
      </VolleyAlert>
      <VolleyAlert severity="info">
        Pick a color for the team, or it will default to blue.
      </VolleyAlert>
    </Box>
  );
}

export default AddHomeTeam;
