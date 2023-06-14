import AddIcon from "@mui/icons-material/Add";
import {
  Add,
  SportsVolleyball,
  Undo,
  Settings,
  ArrowForwardIos,
  ArrowBackIosNew
} from '@mui/icons-material';
import {
  CardActions,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { addEvent } from '../store/match/actions';
import { useAppDispatch, useAppSelector } from '../store/store';
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import Clock from "./clock";
import EventList from "./eventList";
import { callTimeoutEvent, createAddPointEvent } from "./eventFunctions";
import { getInitials } from "../util/names";
import { matchState } from "../store/types";
import { getTextColorFromBackground } from "../util/color";

export function Scoreboard() {
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
    >
      <Grid item xs={12} sm={8} md={6}>
        <Grid container
          spacing={2}
          columns={12}
          justifyContent="space-evenly"
          alignItems="flex-end"
        >
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Grid container
              spacing={2}
              justifyContent="flex-end"
              alignItems="flex-end"
              columns={12}
            >
              <Grid item>
                <Typography align='center' sx={{
                  border: 4, borderRadius: '12px', borderColor: match.teamColor[getLeftTeam(match)],
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {match.currentSetScore[getLeftTeam(match)]}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='right' sx={{
                  border: 6, borderRadius: '12px', borderColor: match.teamColor[getLeftTeam(match)],
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {match.currentScore[getLeftTeam(match)]}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Grid container
              spacing={2}
              justifyContent="flex-start"
              alignItems="flex-end"
              columns={12}
            >
              <Grid item>
                <Typography align='left' sx={{
                  border: 6, borderRadius: '12px', borderColor: match.teamColor[getRightTeam(match)],
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {match.currentScore[getRightTeam(match)]}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='center' sx={{
                  border: 4, borderRadius: '12px', borderColor: match.teamColor[getRightTeam(match)],
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {match.currentSetScore[getRightTeam(match)]}
                </Typography>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container
          columnSpacing={0}
          columns={13}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{
              fontSize: 18,
              textDecoration: (getServer(match.events, getLeftTeam(match)) === 1) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 1, getLeftTeam(match)))} </Typography>
          </Grid>
          <Grid item xs={1}>
            {(getServer(match.events, getRightTeam(match)) === 1) && <ArrowForwardIos />}
            {(getServer(match.events, getLeftTeam(match)) === 1) && <ArrowBackIosNew />}
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{
              fontSize: 18,
              textDecoration: (getServer(match.events, getRightTeam(match)) === 1) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 1, getRightTeam(match)))}</Typography>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{
              fontSize: 18,
              textDecoration: (getServer(match.events, getLeftTeam(match)) === 2) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 2, getLeftTeam(match)))}</Typography>

          </Grid>
          <Grid item xs={1}>
            {(getServer(match.events, getLeftTeam(match)) === 2) && <ArrowBackIosNew />}
            {(getServer(match.events, getRightTeam(match)) === 2) && <ArrowForwardIos />}
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{
              fontSize: 18,
              textDecoration: (getServer(match.events, getRightTeam(match)) === 2) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 2, getRightTeam(match)))}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Scoreboard;

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
