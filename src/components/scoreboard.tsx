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

export function Scoreboard() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();
  const [infoCollapse, setInfoCollapse] = useState(false);

  function homePoint() {
    dispatch(addEvent(createAddPointEvent(TeamType.Home)))
  }

  function awayPoint() {
    dispatch(addEvent(createAddPointEvent(TeamType.Away)))
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
                  border: 4, borderRadius: '12px', borderColor: getBackgroundColor(match.events, TeamType.Home),
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {match.currentSetScore[TeamType.Home]}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='right' sx={{
                  border: 6, borderRadius: '12px', borderColor: getBackgroundColor(match.events, TeamType.Home),
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {match.currentScore[TeamType.Home]}
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
                  border: 6, borderRadius: '12px', borderColor: getBackgroundColor(match.events, TeamType.Away),
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {match.currentScore[TeamType.Away]}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='center' sx={{
                  border: 4, borderRadius: '12px', borderColor: getBackgroundColor(match.events, TeamType.Away),
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {match.currentSetScore[TeamType.Away]}
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
            <Typography sx={{ fontSize: 18 }}> {match.homeTeam.player1Name} <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, TeamType.Home) === 1 ? "true" : "none"
            }} /></Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 18 }}> <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, TeamType.Away) === 1 ? "true" : "none"
            }} /> {match.awayTeam.player1Name}</Typography>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 18 }}> {match.homeTeam.player2Name} <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, TeamType.Home) === 2 ? "true" : "none"
            }} /></Typography>

          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 18 }}> <SportsVolleyball sx={{
              fontSize: 18, display: getServer(match.events, TeamType.Away) === 2 ? "true" : "none"
            }} /> {match.awayTeam.player2Name}</Typography>
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
            <Button variant="contained" onClick={homePoint}
              sx={{
                width: 1, height: 84, backgroundColor: getBackgroundColor(match.events, TeamType.Home),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, TeamType.Home) }
              }}>
              <Add sx={{ fontSize: 84, color: getTextColor(match.events, TeamType.Home) }} />
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button variant="contained" onClick={awayPoint}
              sx={{
                width: 1, height: 84, backgroundColor: getBackgroundColor(match.events, TeamType.Away),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, TeamType.Away) }
              }}>
              <Add sx={{ fontSize: 84, color: getTextColor(match.events, TeamType.Away) }} />
            </Button>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button disabled={match.teamTimeout[TeamType.Home]} onClick={homeTeamTimeout} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: getBackgroundColor(match.events, TeamType.Home),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, TeamType.Home) }
              }}>
              <Typography sx={{ fontSize: 18, color: getTextColor(match.events, TeamType.Home) }}> TIMEOUT</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={match.teamTimeout[TeamType.Away]} onClick={awayTeamTimeout} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: getBackgroundColor(match.events, TeamType.Away),
                '&:hover': { backgroundColor: getBackgroundColor(match.events, TeamType.Away) }

              }}>
              <Typography sx={{ fontSize: 18, color: getTextColor(match.events, TeamType.Away) }}> TIMEOUT</Typography>
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
