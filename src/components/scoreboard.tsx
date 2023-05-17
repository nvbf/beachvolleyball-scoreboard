import AddIcon from "@mui/icons-material/Add";
import {
  Add,
  SportsVolleyball,
  Undo,
  Settings
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
import { callTimeoutEvent, createAddPointEvent, getBackgroundColor, getTextColor } from "./scoreboard/eventFunctions";
import { getInitials } from "../util/names";
import { matchState } from "../store/types";

export function Scoreboard() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();
  const [infoCollapse, setInfoCollapse] = useState(false);

  function homePoint() {
    dispatch(addEvent(createAddPointEvent(TeamType.Home)))
  }

  function addPoint(team: TeamType) {
    dispatch(addEvent(createAddPointEvent(team)))
  }

  function awayPoint() {
    dispatch(addEvent(createAddPointEvent(TeamType.Away)))
  }

  function teamTimeout(team: TeamType) {
    dispatch(addEvent(callTimeoutEvent(team)))
  }

  function homeTeamTimeout() {
    dispatch(addEvent(callTimeoutEvent(TeamType.Home)))
  }

  function awayTeamTimeout() {
    dispatch(addEvent(callTimeoutEvent(TeamType.Away)))
  }

  function toggleSettings() {
    // dispatch(callTimeout(Actor.AwayTeam));
  }


  function formatEventBasedOnEventType(event: Event) {
    if (event.eventType === EventType.Score) {
      return `${event.team} scored a point!`
    }
    return event.eventType
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
                  border: 4, borderRadius: '12px', borderColor: getBackgroundColor(match.events, getLeftTeam(match)),
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {match.currentSetScore[getLeftTeam(match)]}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='right' sx={{
                  border: 6, borderRadius: '12px', borderColor: getBackgroundColor(match.events, getLeftTeam(match)),
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
                  border: 6, borderRadius: '12px', borderColor: getBackgroundColor(match.events, getRightTeam(match)),
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {match.currentScore[getRightTeam(match)]}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='center' sx={{
                  border: 4, borderRadius: '12px', borderColor: getBackgroundColor(match.events, getRightTeam(match)),
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
          columnSpacing={8}
          columns={12}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 18 }}> {getInitials(getPlayer(match, 1, getLeftTeam(match)))} <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, getLeftTeam(match)) === 1 ? "true" : "none"
            }} /></Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 18 }}> <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, getRightTeam(match)) === 1 ? "true" : "none"
            }} /> {getInitials(getPlayer(match, 1, getRightTeam(match)))}</Typography>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 18 }}> {getInitials(getPlayer(match, 2, getLeftTeam(match)))} <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, getLeftTeam(match)) === 2 ? "true" : "none"
            }} /></Typography>

          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 18 }}> <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, getRightTeam(match)) === 2 ? "true" : "none"
            }} /> {getInitials(getPlayer(match, 2, getRightTeam(match)))}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container
          columnSpacing={8}
          rowSpacing={2}
          columns={12}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button disabled={match.finished} variant="contained" onClick={addPoint.bind(null, getLeftTeam(match))}
              sx={{
                width: 1, height: 84, backgroundColor: getBackgroundColor(match.events, getLeftTeam(match)),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, getLeftTeam(match)) }
              }}>
              <Add sx={{ fontSize: 84, color: getTextColor(match.events, getLeftTeam(match)) }} />
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={match.finished} variant="contained" onClick={addPoint.bind(null, getRightTeam(match))}
              sx={{
                width: 1, height: 84, backgroundColor: getBackgroundColor(match.events, getRightTeam(match)),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, getRightTeam(match)) }
              }}>
              <Add sx={{ fontSize: 84, color: getTextColor(match.events, getRightTeam(match)) }} />
            </Button>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button disabled={match.teamTimeout[getLeftTeam(match)] || match.finished} onClick={teamTimeout.bind(null, getLeftTeam(match))} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: getBackgroundColor(match.events, getLeftTeam(match)),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, getLeftTeam(match)) }
              }}>
              <Typography sx={{ fontSize: 18, color: getTextColor(match.events, getLeftTeam(match)) }}> TIMEOUT</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={match.teamTimeout[getRightTeam(match)] || match.finished} onClick={teamTimeout.bind(null, getRightTeam(match))} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: getBackgroundColor(match.events, getRightTeam(match)),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, getRightTeam(match)) }

              }}>
              <Typography sx={{ fontSize: 18, color: getTextColor(match.events, getRightTeam(match)) }}> TIMEOUT</Typography>
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

export default Scoreboard;

export const getRightTeam = (match: matchState): TeamType => {
  if (match.mirrorSides){
    return TeamType.Home  
  }
  return TeamType.Away
}

export const getLeftTeam = (match: matchState): TeamType => {
  if (match.mirrorSides) {
    return TeamType.Away
  }
  return TeamType.Home
}

export const getPlayer = (match: matchState, playerId: number, teamType: TeamType): string => {
  if(teamType === TeamType.Home) {
    if (playerId === 1){
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
