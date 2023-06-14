import {
  Add,
  ArrowForwardIos,
  ArrowBackIosNew
} from '@mui/icons-material';
import {
  CardActions,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { addEvent } from '../../store/match/actions';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType, Event, EventType } from './../types';
import Grid from "@mui/material/Grid"
import EventList from "./../eventList";
import { callTimeoutEvent, createAddPointEvent } from "../eventFunctions";
import { getInitials } from "../../util/names";
import { matchState } from "../../store/types";
import { getTextColorFromBackground } from "../../util/color";

export function MatchButtons() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();
  const [infoCollapse, setInfoCollapse] = useState(false);

  function addPoint(team: TeamType) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: createAddPointEvent(team) }))
  }

  function teamTimeout(team: TeamType) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: callTimeoutEvent(team) }))
  }

  return (
    <Grid container
      justifyContent="center"
      alignItems="center"
      rowSpacing={0}
      spacing={2}
      columns={12}
      marginTop={1}
    >
      <Grid item xs={12}>
        <Grid container
          columnSpacing={0}
          rowSpacing={2}
          columns={13}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button disabled={match.finished} variant="contained" onClick={addPoint.bind(null, getLeftTeam(match))}
              sx={{
                width: 1, height: 84, backgroundColor: match.teamColor[getLeftTeam(match)],
                '&:hover': { backgroundColor: match.teamColor[getLeftTeam(match)] }
              }}>
              <Add sx={{ fontSize: 84, color: getTextColorFromBackground(match.teamColor[getLeftTeam(match)]) }} />
            </Button>
          </Grid>
          <Grid item xs={1}>

          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={match.finished} variant="contained" onClick={addPoint.bind(null, getRightTeam(match))}
              sx={{
                width: 1, height: 84, backgroundColor: match.teamColor[getRightTeam(match)],
                '&:hover': { backgroundColor: match.teamColor[getRightTeam(match)] }
              }}>
              <Add sx={{ fontSize: 84, color: getTextColorFromBackground(match.teamColor[getRightTeam(match)]) }} />
            </Button>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button disabled={match.teamTimeout[getLeftTeam(match)] || match.finished} onClick={teamTimeout.bind(null, getLeftTeam(match))} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: match.teamColor[getLeftTeam(match)],
                '&:hover': { backgroundColor: match.teamColor[getLeftTeam(match)] }
              }}>
              <Typography sx={{ fontSize: 18, color: getTextColorFromBackground(match.teamColor[getLeftTeam(match)]) }}> TIMEOUT</Typography>
            </Button>
          </Grid>
          <Grid item xs={1}>

          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={match.teamTimeout[getRightTeam(match)] || match.finished} onClick={teamTimeout.bind(null, getRightTeam(match))} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: match.teamColor[getRightTeam(match)],
                '&:hover': { backgroundColor: match.teamColor[getRightTeam(match)] }

              }}>
              <Typography sx={{ fontSize: 18, color: getTextColorFromBackground(match.teamColor[getRightTeam(match)]) }}> TIMEOUT</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MatchButtons;

export const getRightTeam = (match: matchState): TeamType => {
  if (match.leftSideTeam === TeamType.None || match.leftSideTeam === TeamType.Home) {
    return TeamType.Away
  } else {
    return TeamType.Home
  }
}

export const getLeftTeam = (match: matchState): TeamType => {
  if (match.leftSideTeam === TeamType.None || match.leftSideTeam === TeamType.Home) {
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
