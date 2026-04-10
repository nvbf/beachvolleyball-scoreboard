import {
  Add,
} from '@mui/icons-material';
import {
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { addEvent } from '../../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType, Event, EventType } from './../types';
import Grid from "@mui/material/Grid"
import { callTimeoutEvent, createAddPointEvent } from "../eventFunctions";
import { matchState } from "../../store/types";
import { getTextColorFromBackground } from "../../util/color";

export function MatchButtons() {
  const match = useAppSelector((state) => state.match);
  const leftTeam = getLeftTeam(match);
  const rightTeam = getRightTeam(match);

  const dispatch = useAppDispatch();

  function addPoint(team: TeamType) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: createAddPointEvent(team, match.authUserId) }))
  }

  function teamTimeout(team: TeamType) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: callTimeoutEvent(team, match.authUserId) }))
  }

  return (
    <Grid container
      justifyContent="center"
      alignItems="center"
      rowSpacing={0}
      spacing={2}
      columns={12}
      marginTop={1.5}
    >
      <Grid size={12}>
        <Grid container
          columnSpacing={0}
          rowSpacing={2}
          columns={13}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid size={6} sx={{ textAlign: 'right', paddingRight: 0.75 }}>
            <Button disabled={match.finished} variant="contained" onClick={addPoint.bind(null, leftTeam)}
              sx={{
                width: 1,
                height: 130,
                borderRadius: '18px',
                boxShadow: '0 8px 15px rgba(0,0,0,0.14)',
                backgroundColor: match.teamColor[leftTeam],
                '&:hover': { backgroundColor: match.teamColor[leftTeam] }
              }}>
              <Add sx={{ fontSize: 72, color: getTextColorFromBackground(match.teamColor[leftTeam]) }} />
            </Button>
          </Grid>
          <Grid size={1}>

          </Grid>
          <Grid size={6} sx={{ textAlign: 'left', paddingLeft: 0.75 }}>
            <Button disabled={match.finished} variant="contained" onClick={addPoint.bind(null, rightTeam)}
              sx={{
                width: 1,
                height: 130,
                borderRadius: '18px',
                boxShadow: '0 8px 15px rgba(0,0,0,0.14)',
                backgroundColor: match.teamColor[rightTeam],
                '&:hover': { backgroundColor: match.teamColor[rightTeam] }
              }}>
              <Add sx={{ fontSize: 72, color: getTextColorFromBackground(match.teamColor[rightTeam]) }} />
            </Button>
          </Grid>

          <Grid size={6} sx={{ textAlign: 'right', paddingRight: 0.75 }}>
            <Button disabled={match.teamTimeout[leftTeam] || match.finished} onClick={teamTimeout.bind(null, leftTeam)} variant="contained"
              sx={{
                width: 1,
                minHeight: 52,
                textTransform: 'uppercase',
                borderRadius: '12px',
                letterSpacing: '0.07em',
                boxShadow: 'none',
                backgroundColor: 'rgba(28,28,30,0.78)',
                '&:hover': { backgroundColor: 'rgba(28,28,30,0.88)' }
              }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>TIMEOUT</Typography>
            </Button>
          </Grid>
          <Grid size={1}>

          </Grid>
          <Grid size={6} sx={{ textAlign: 'left', paddingLeft: 0.75 }}>
            <Button disabled={match.teamTimeout[rightTeam] || match.finished} onClick={teamTimeout.bind(null, rightTeam)} variant="contained"
              sx={{
                width: 1,
                minHeight: 52,
                textTransform: 'uppercase',
                borderRadius: '12px',
                letterSpacing: '0.07em',
                boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                backgroundColor: match.teamColor[rightTeam],
                '&:hover': { backgroundColor: match.teamColor[rightTeam] }

              }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: getTextColorFromBackground(match.teamColor[rightTeam]) }}>TIMEOUT</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MatchButtons;

export const getRightTeam = (match: matchState): TeamType => {
  if (match.leftSideTeam === TeamType.None || match.leftSideTeam === TeamType.Home || match.noMirrorSides) {
    return TeamType.Away
  } else {
    return TeamType.Home
  }
}

export const getLeftTeam = (match: matchState): TeamType => {
  if (match.leftSideTeam === TeamType.None || match.leftSideTeam === TeamType.Home || match.noMirrorSides) {
    return TeamType.Home
  } else {
    return TeamType.Away
  }
}

export const getPlayer = (match: matchState, playerId: number, teamType: TeamType): string => {
  if (teamType === TeamType.Home) {
    if (playerId === 1) {
      return match.homeTeam.player1Name
    } else {
      return match.homeTeam.player2Name
    }
  } else {
    if (playerId === 1) {
      return match.awayTeam.player1Name
    } else {
      return match.awayTeam.player2Name
    }
  }
}

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
