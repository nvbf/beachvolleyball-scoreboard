import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAppSelector, useAppDispatch } from '../../store/store'
import { addAwayTeam, addHomeTeam, resetTournamentId, setMatchId, setTournamentId } from '../../store/match/actions';
import { Team, TeamType } from '../types';
import { Grid, Typography } from '@mui/material';

export function Settings() {

  let tournamentId = useAppSelector(state => state.match.tournamentId)
  let matchId = useAppSelector(state => state.match.matchId)

  const dispatch = useAppDispatch()

  const [tournamentIdValue, setTournamentIdValue] = useState(tournamentId === "null" ? "" : tournamentId);
  const [matchIdValue, seMmatchIdValue] = useState(matchId === "null" ? "" : matchId);

  function handleTournamentChange(name: string) {
    setTournamentIdValue(name)
  }

  function handleMatchIdChange(name: string) {
    seMmatchIdValue(name)
  }

  function handleSubmit() {
    dispatch(setTournamentId(tournamentIdValue))
    dispatch(setMatchId(matchIdValue))
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

        <TextField
          sx={{
            width: 1, height: 64
          }}
          label="Tournament ID"
          value={tournamentIdValue}
          onChange={(e) => handleTournamentChange(e.target.value)}
        />
        <TextField
          sx={{
            width: 1, height: 64
          }}
          label="Match ID"
          value={matchIdValue}
          onChange={(e) => handleMatchIdChange(e.target.value)}
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

export default Settings;
