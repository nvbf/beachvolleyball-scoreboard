import AddIcon from "@mui/icons-material/Add";
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
import { addEvent } from '../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { LeftMarginBox, VolleyAlert, VolleyAvatar, VolleyCard, VolleyCardHeader, VolleyRowStack, VolleyStack } from "../util/styles";
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import EventList from "./eventList";
import { getInitials } from "../util/names";
import { selectFirstServerEvent, selectFirstServingTeamEvent } from "./eventFunctions";
import { matchState } from "../store/types";
import { getTextColorFromBackground } from "../util/color";

export function ServeOrder() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();

  function setFirstServerTeam(team: TeamType) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: selectFirstServingTeamEvent(team) }));
  }

  function setHomeServer(player: number) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: selectFirstServerEvent(TeamType.Home, player) }));
  }

  function setAwayServer(player: number) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: selectFirstServerEvent(TeamType.Away, player) }));
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
            columnSpacing={2}
            rowSpacing={2}
            justifyContent="center"
            columns={12}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
          >
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="h4"> First team to serve </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', display: showServer(match, TeamType.Home, 0) }}>
              <Button disabled={match.firstServerTeam !== TeamType.None} variant="contained" onClick={setFirstServerTeam.bind(null, TeamType.Home)}
                sx={{
                  width: 1, height: 96, backgroundColor: match.teamColor[TeamType.Home],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Home] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Home]) }}>
                  <Box>{getInitials(match.homeTeam.player1Name)}</Box>
                  <Box>{getInitials(match.homeTeam.player2Name)}</Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left', display: showServer(match, TeamType.Away, 0) }}>
              <Button disabled={match.firstServerTeam !== TeamType.None} variant="contained" onClick={setFirstServerTeam.bind(null, TeamType.Away)}
                sx={{
                  width: 1, height: 96, backgroundColor: match.teamColor[TeamType.Away],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Away] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Away]) }}>
                  <Box>{getInitials(match.awayTeam.player1Name)}</Box>
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
              <Typography variant="h4"> First home team server</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', display: showServer(match, TeamType.Home, 1) }}>
              <Button disabled={match.firstServer[TeamType.Home] !== 0} variant="contained" onClick={setHomeServer.bind(null, 1)}
                sx={{
                  width: 1, height: 76, backgroundColor: match.teamColor[TeamType.Home],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Home] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Home]) }}>
                  <Box>{getInitials(match.homeTeam.player1Name)} </Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left', display: showServer(match, TeamType.Home, 2) }}>
              <Button disabled={match.firstServer[TeamType.Home] !== 0} variant="contained" onClick={setHomeServer.bind(null, 2)}
                sx={{
                  display: showServer(match, TeamType.Home, 2),
                  width: 1, height: 76, backgroundColor: match.teamColor[TeamType.Home],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Home] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Home]) }}>
                  <Box>{getInitials(match.homeTeam.player2Name)}</Box>
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
              <Typography variant="h4"> First away team server</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', display: showServer(match, TeamType.Away, 1) }}>
              <Button
                disabled={match.firstServer[TeamType.Away] !== 0}
                variant="contained" onClick={setAwayServer.bind(null, 1)}
                sx={{
                  display: showServer(match, TeamType.Away, 1),
                  width: 1, height: 76, backgroundColor: match.teamColor[TeamType.Away],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Away] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Away]) }}>
                  <Box>{getInitials(match.awayTeam.player1Name)} </Box>
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'left', display: showServer(match, TeamType.Away, 2) }}>
              <Button disabled={match.firstServer[TeamType.Away] !== 0} variant="contained" onClick={setAwayServer.bind(null, 2)}
                sx={{
                  display: showServer(match, TeamType.Away, 2),
                  width: 1, height: 76, backgroundColor: match.teamColor[TeamType.Away],
                  '&:hover': { backgroundColor: match.teamColor[TeamType.Away] }
                }}>
                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[TeamType.Away]) }}>
                  <Box>{getInitials(match.awayTeam.player2Name)}</Box>
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default ServeOrder;

export const getServer = (events: Event[], team: TeamType): number => {
  let servingPlayer = 0;
  let servingTeam = TeamType.Home;
  let lastServingTeam: TeamType;
  let lastServingPlayer: Number;

  events.forEach((event) => {
    // check if the event was undone
    if (!event.undone) {
      // check the event type and update the score and serving team/player
      switch (event.eventType) {
        case EventType.Score:
          if (lastServingTeam !== event.team) {
            servingTeam = event.team
            if (servingTeam !== team) {
              break;
            }
            if (lastServingPlayer === 1) {
              servingPlayer = 2;
            } else {
              servingPlayer = 1;
            }
          }
          break;
        case EventType.FirstPlayerServer:
          if (event.team === team) {
            servingPlayer = event.playerId;
          }
          break;
        case EventType.FirstTeamServer:
          servingTeam = event.team;
          break;
      }
      lastServingTeam = servingTeam;
      lastServingPlayer = servingPlayer
    }
  });

  if (servingTeam == team) {
    return servingPlayer
  } else {
    return 0
  }
};

export function showServer(matchState: matchState, team: TeamType, playerId: number): string | undefined {
  if (playerId === 0) {
    return matchState.firstServerTeam === TeamType.None || matchState.firstServerTeam === team ? 'visible' : 'none'
  } else if (team === TeamType.Home) {
    return matchState.firstServer[TeamType.Home] === 0 || matchState.firstServer[TeamType.Home] === playerId ? 'visible' : 'none'
  } else {
    return matchState.firstServer[TeamType.Away] === 0 || matchState.firstServer[TeamType.Away] === playerId ? 'visible' : 'none'
  }
}
