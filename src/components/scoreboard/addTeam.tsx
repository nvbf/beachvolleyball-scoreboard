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
  const [player1Number, setPlayer1Number] = useState(team.player1Number ?? "");
  const [player2Number, setPlayer2Number] = useState(team.player2Number ?? "");

  function handlePlayer1Name(name: string) {
    setPlayer1Name(name)
  }

  function handlePlayer2Name(name: string) {
    setPlayer2Name(name)
  }

  function handlePlayer1Number(value: string) {
    setPlayer1Number(value.replace(/\D/g, '').slice(0, 2))
  }

  function handlePlayer2Number(value: string) {
    setPlayer2Number(value.replace(/\D/g, '').slice(0, 2))
  }

  function handleSubmit() {
    if (teamType === TeamType.Home) {
      dispatch(addHomeTeam({
        player1Name: player1Name,
        player2Name: player2Name,
        player1Number: player1Number,
        player2Number: player2Number,
      }))
    } else {
      dispatch(addAwayTeam({
        player1Name: player1Name,
        player2Name: player2Name,
        player1Number: player1Number,
        player2Number: player2Number,
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
      <Grid size={12}>
        <Typography sx={{ fontSize: 28 }}>Add {teamType === TeamType.Home ? "home" : "away"} team!</Typography>
      </Grid>
      <Grid size={12}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            sx={{
              flex: 3, height: 64
            }}
            label="Player 1"
            value={player1Name}
            onChange={(e) => handlePlayer1Name(e.target.value)}
          />
          <TextField
            sx={{
              flex: 1, height: 64
            }}
            label="Number"
            value={player1Number}
            onChange={(e) => handlePlayer1Number(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 2 } }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            sx={{
              flex: 3, height: 64
            }}
            label="Player 2"
            value={player2Name}
            onChange={(e) => handlePlayer2Name(e.target.value)}
          />
          <TextField
            sx={{
              flex: 1, height: 64
            }}
            label="Number"
            value={player2Number}
            onChange={(e) => handlePlayer2Number(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 2 } }}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'left' }}>
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
