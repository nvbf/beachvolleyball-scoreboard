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
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { addPoint, scorePoint, callTimeout, undoLastEvent, firstServerHome, firstServerAway, firstServerTeam } from '../store/match/actions';
import { useAppDispatch, useAppSelector } from '../store/store';
import { LeftMarginBox, VolleyAlert, VolleyAvatar, VolleyCard, VolleyCardHeader, VolleyRowStack, VolleyStack } from "../util/styles";
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import Clock from "./clock";
import EventList from "./eventList";
import { getInitials } from "../util/names";

export function ServeOrder() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();

  function setFirstServerTeam(team: TeamType) {
    dispatch(firstServerTeam(team));
  }

  function setHomeServer(player: number) {
    dispatch(firstServerHome(player));
  }

  function setAwayServer(player: number) {
    dispatch(firstServerAway(player));
  }

  return (
    <Grid container
      justifyContent="center"
      alignItems="center"
      rowSpacing={0}
      spacing={2}
      columns={12}
    >
      <Grid item xs={12}>
        <Grid container
          columnSpacing={8}
          rowSpacing={2}
          justifyContent="center"
          columns={12}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 32 }}> First team to serve </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right', display: showServer(match.events, TeamType.Home, 0) }}>
            <Button disabled={serveOrderSet(match.events)[0] !== TeamType.None} variant="contained" onClick={setFirstServerTeam.bind(null, TeamType.Home)}
              sx={{
                width: 1, height: 84, backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.main' }
              }}>
              <Typography sx={{ fontSize: 22 }}>
                <Box>{getInitials(match.homeTeam.player1Name)}</Box>
                <Box>{getInitials(match.homeTeam.player2Name)}</Box>
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left', display: showServer(match.events, TeamType.Away, 0) }}>
            <Button disabled={serveOrderSet(match.events)[0] !== TeamType.None} variant="contained" onClick={setFirstServerTeam.bind(null, TeamType.Away)}
              sx={{
                width: 1, height: 84, backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.main' }
              }}>
              <Typography sx={{ fontSize: 22 }}>
                <Box>{getInitials(match.awayTeam.player1Name)}</Box>
                <Box>{getInitials(match.awayTeam.player2Name)}</Box>
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container
          columnSpacing={8}
          rowSpacing={2}
          columns={12}
          justifyContent="center"
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 32 }}> First home team server</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right', display: showServer(match.events, TeamType.Home, 1) }}>
            <Button disabled={serveOrderSet(match.events)[1] !== 0} variant="contained" onClick={setHomeServer.bind(null, 1)}
              sx={{
                width: 1, height: 84, backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.main' }
              }}>
              <Typography sx={{ fontSize: 22 }}>
                <Box>{getInitials(match.homeTeam.player1Name)} </Box>
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left', display: showServer(match.events, TeamType.Home, 2) }}>
            <Button disabled={serveOrderSet(match.events)[1] !== 0} variant="contained" onClick={setHomeServer.bind(null, 2)}
              sx={{
                display: showServer(match.events, TeamType.Home, 2),
                width: 1, height: 84, backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.main' }
              }}>
              <Typography sx={{ fontSize: 22 }}>
                <Box>{getInitials(match.homeTeam.player2Name)}</Box>
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container
          columnSpacing={8}
          rowSpacing={2}
          columns={12}
          justifyContent="center"
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 32 }}> First away team server</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right', display: showServer(match.events, TeamType.Away, 1) }}>
            <Button
              disabled={serveOrderSet(match.events)[2] !== 0}
              variant="contained" onClick={setAwayServer.bind(null, 1)}
              sx={{
                display: showServer(match.events, TeamType.Away, 1),
                width: 1, height: 84, backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.main' }
              }}>
              <Typography sx={{ fontSize: 22 }}>
                <Box>{getInitials(match.awayTeam.player1Name)} </Box>
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left', display: showServer(match.events, TeamType.Away, 2) }}>
            <Button disabled={serveOrderSet(match.events)[2] !== 0} variant="contained" onClick={setAwayServer.bind(null, 2)}
              sx={{
                display: showServer(match.events, TeamType.Away, 2),
                width: 1, height: 84, backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.main' }
              }}>
              <Typography sx={{ fontSize: 22 }}>
                <Box>{getInitials(match.awayTeam.player2Name)}</Box>
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <EventList events={match.events} />
      </Grid>
    </Grid>
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

export function showServer(events: Event[], team: TeamType, playerId: number): string | undefined {
  let servers = serveOrderSet(events)
  if (playerId === 0) {
    return servers[0] === TeamType.None || servers[0] === team ? 'visible' : 'none'
  } else if (team === TeamType.Home) {
    return servers[1] === 0 || servers[1] === playerId ? 'visible' : 'none'
  } else {
    return servers[2] === 0 || servers[2] === playerId ? 'visible' : 'none'
  }
}

export function serveOrderSet(events: Event[]): [TeamType, number, number] {
  const sets: { [key: string]: number } = { [TeamType.Home]: 0, [TeamType.Away]: 0 };
  let homeSetScore = [0, 0, 0];
  let awaySetScore = [0, 0, 0];
  let currentSet = 1;
  let serveOrderSet = false
  let firstHomeServerSet = false
  let firstAwayServerSet = false
  let firstHomePlayerServer = 0
  let firstAwayPlayerServer = 0
  let firstTeamServer = TeamType.None

  events.forEach((event) => {
    if (event.undone) {
      return;
    }
    if (event.eventType === EventType.Score) {
      const setIndex = currentSet - 1;
      if (event.team === TeamType.Home) {
        homeSetScore[setIndex] += 1;
      } else {
        awaySetScore[setIndex] += 1;
      }
      if (currentSet === 1 || currentSet === 2) {
        if (homeSetScore[setIndex] >= 21 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          sets[TeamType.Home] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
          serveOrderSet = false;
          firstHomeServerSet = false;
          firstAwayServerSet = false;
          firstHomePlayerServer = 0;
          firstAwayPlayerServer = 0;
          firstTeamServer = TeamType.None
        } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[TeamType.Away] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
          serveOrderSet = false;
          firstHomeServerSet = false;
          firstAwayServerSet = false;
          firstHomePlayerServer = 0;
          firstAwayPlayerServer = 0;
          firstTeamServer = TeamType.None
        }
      } else {
        if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          sets[TeamType.Home] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[TeamType.Away] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        }
      }
    } else if (event.eventType === EventType.FirstPlayerServer) {
      if (event.team === TeamType.Home) {
        firstHomeServerSet = true
        firstHomePlayerServer = event.playerId
      } else {
        firstAwayServerSet = true
        firstAwayPlayerServer = event.playerId
      }
    } else if (event.eventType === EventType.FirstTeamServer) {
      serveOrderSet = true
      firstTeamServer = event.team
    }
  });
  return [firstTeamServer, firstHomePlayerServer, firstAwayPlayerServer];
}