import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { CirclePicker } from "react-color";
import { useAppSelector, useAppDispatch } from '../../store/store'
import {
  VolleyCard, VolleyCardHeader, VolleyStack, VolleyFormControl, ShirtColors,
  RightBox, VolleyAlert
} from "../../util/styles"
import { addAwayTeam, addHomeTeam } from '../../store/match/reducer';
import { Team, TeamType } from '../types';
import { Grid, Typography } from '@mui/material';


interface AddTeamProps {
  teamType: TeamType;
}


export function AddTeam({ teamType }: AddTeamProps) {
  let team: Team
  if (teamType === TeamType.Home) {
    team = useAppSelector(state => state.match.homeTeam)
  } else {
    team = useAppSelector(state => state.match.awayTeam)
  }
  const dispatch = useAppDispatch()

  const [player1Name, setPlayer1Name] = useState(team.player1Name);
  const [player2Name, setPlayer2Name] = useState(team.player2Name);

  function handlePlayer1Name(name: string) {
    setPlayer1Name(name)
  }

  function handlePlayer2Name(name: string) {
    setPlayer2Name(name)
  }

  function handleSubmit() {
    if (teamType === TeamType.Home) {
      dispatch(addHomeTeam({
        player1Name: player1Name,
        player2Name: player2Name,
      }))
    } else {
      dispatch(addAwayTeam({
        player1Name: player1Name,
        player2Name: player2Name,
      }))
    }
  }

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={1}
      justifyContent="center"
      columns={12}
      sx={{ alignSelf: 'center', textAlign: 'center' }}
    >
      <Grid item xs={12}>
        <Typography sx={{ fontSize: 28 }}>Add {teamType === TeamType.Home ? "home" : "away"} team!</Typography>
      </Grid>
      <Grid item xs={12}>

        <TextField
          sx={{
            width: 1, height: 64
          }}
          label="Player 1"
          value={player1Name}
          onChange={(e) => handlePlayer1Name(e.target.value)}
        />
        <TextField
          sx={{
            width: 1, height: 64
          }}
          label="Player 2"
          value={player2Name}
          onChange={(e) => handlePlayer2Name(e.target.value)}
        />
      </Grid>
      <Grid item md={6} xs={12} sx={{ textAlign: 'left' }}>
        <Button variant="contained" onClick={handleSubmit.bind(null)}
          sx={{
            width: 1, height: 64
          }}>
          <Typography>
            Done!
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddTeam;
