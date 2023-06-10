import AddIcon from "@mui/icons-material/Add";
import { v4 } from "uuid";
import {
  Add,
  SportsVolleyball,
  Undo,
  Settings
} from '@mui/icons-material';
import {
  Box,
  CardActions,
  ThemeProvider,
  Typography,
  createTheme,
  responsiveFontSizes
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { addEvent, clearNotification, initMatch, resetAwayPlayerName, resetHomePlayerName, resetMatchId, resetTeamColor, resetTournamentId } from '../../store/match/actions';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType, Event, EventType } from './../types';
import Grid from "@mui/material/Grid"
import EventList from "./../eventList";
import { getInitials } from "../../util/names";
import { getBackgroundColor, getTextColor, selectFirstServerEvent, selectFirstServingTeamEvent } from "./../scoreboard/eventFunctions";
import { matchState } from "../../store/types";
import Clock from "../clock";
import { getTextColorFromBackground } from "../../util/color";

export function InitMatch() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();

  function setMatchId() {
    dispatch(resetMatchId());
  }

  function setTournamentId() {
    dispatch(resetTournamentId());
  }

  function setTeamColors(team: TeamType) {
    dispatch(resetTeamColor(team));
  }

  function setHomePlayerName(player: number) {
    dispatch(resetHomePlayerName(player));
  }

  function setAwayPlayerName(player: number) {
    dispatch(resetAwayPlayerName(player));
  }

  function handleDone() {
    dispatch(initMatch({
      id: v4(),
      awayColor: match.teamColor[TeamType.Away],
      homeColor: match.teamColor[TeamType.Home],
      awayTeam: { player1Name: match.awayTeam.player1Name, player2Name: match.awayTeam.player2Name },
      homeTeam: { player1Name: match.homeTeam.player1Name, player2Name: match.homeTeam.player2Name },
      matchId: match.matchId,
      tournamentId: match.tournamentId,
      timestamp: Date.now()
    }));
  }


  let theme = createTheme();
  theme = responsiveFontSizes(theme);
  theme.typography.h6 = {
    fontWeight: 'normal',
    fontSize: '1.0rem',
    '@media (min-width:600px)': {
      fontSize: '1.4rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.6rem',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container
        justifyContent="center"
        alignItems="center"
        rowSpacing={0}
        spacing={2}
        columns={12}
      >
        <Grid item xs={12}>
          <Grid container
            spacing={2}
            columns={12}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
          >
            <Grid item xs={12}>
              <Typography align='center' variant="h2">
                <Clock format="24h" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <Grid container
        justifyContent="center"
        alignItems="center"
        rowSpacing={0}
        spacing={2}
        columns={12}
      >
        <Grid item xs={12}>
          <Grid container
            columnSpacing={2}
            rowSpacing={2}
            justifyContent="center"
            columns={12}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
          >
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="h4">Change player names:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button variant="contained" onClick={setHomePlayerName.bind(null, 1)}
                sx={{
                  width: 1, height: 54, backgroundColor: match.teamColor[TeamType.Home],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Home] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Home]) }}>
                  <Box>{getInitials(match.homeTeam.player1Name)}</Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left' }}>
              <Button variant="contained" onClick={setAwayPlayerName.bind(null, 1)}
                sx={{
                  width: 1, height: 54, backgroundColor: match.teamColor[TeamType.Away],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Away] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Away]) }}>
                  <Box>{getInitials(match.awayTeam.player1Name)}</Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button variant="contained" onClick={setHomePlayerName.bind(null, 2)}
                sx={{
                  width: 1, height: 54, backgroundColor: match.teamColor[TeamType.Home],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Home] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Home]) }}>
                  <Box>{getInitials(match.homeTeam.player2Name)}</Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left' }}>
              <Button variant="contained" onClick={setAwayPlayerName.bind(null, 2)}
                sx={{
                  width: 1, height: 54, backgroundColor: match.teamColor[TeamType.Away],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Away] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Away]) }}>
                  <Box>{getInitials(match.awayTeam.player2Name)}</Box>
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container
            columnSpacing={2}
            rowSpacing={2}
            columns={12}
            justifyContent="center"
            sx={{ alignSelf: 'center', textAlign: 'center' }}
          >
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="h4">Change team colors:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button variant="contained" onClick={setTeamColors.bind(null, TeamType.Home)}
                sx={{
                  width: 1, height: 76, backgroundColor: match.teamColor[TeamType.Home],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Home] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Home]) }}>
                  <Box>{match.teamColor[TeamType.Home]}</Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left' }}>
              <Button variant="contained" onClick={setTeamColors.bind(null, TeamType.Away)}
                sx={{
                  width: 1, height: 76, backgroundColor: match.teamColor[TeamType.Away],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Away] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Away]) }}>
                  <Box>{match.teamColor[TeamType.Away]}</Box>
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container
            columnSpacing={2}
            rowSpacing={2}
            columns={12}
            justifyContent="center"
            sx={{ alignSelf: 'center', textAlign: 'center' }}
          >
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="h4"> Change values for:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained" onClick={setMatchId.bind(null)}
                sx={{
                  width: 1, height: 96
                }}>
                <Typography variant="h6">
                  <Box>Match Id </Box>
                  <Box>{match.matchId}</Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left' }}>
              <Button variant="contained" onClick={setTournamentId.bind(null)}
                sx={{
                  width: 1, height: 96
                }
                }>
                <Typography variant="h6">
                  <Box>Tournament id</Box>
                  <Box>{match.tournamentId}</Box>
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} sx={{ textAlign: 'left' }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h4"> If all things looks good, click here:</Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={handleDone.bind(null)}
              sx={{
                width: 1, height: 96
              }}>
              <Typography variant="h3">
                Start match!
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default InitMatch;
