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
import { addPoint, scorePoint, callTimeout, undoLastEvent } from '../store/match/actions';
import { useAppDispatch, useAppSelector } from '../store/store';
import { LeftMarginBox, VolleyAlert, VolleyAvatar, VolleyCard, VolleyCardHeader, VolleyRowStack, VolleyStack } from "../util/styles";
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import Clock from "./clock";
import EventList from "./eventList";

export function Scoreboard() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();
  const [infoCollapse, setInfoCollapse] = useState(false);

  function homePoint() {
    dispatch(scorePoint(TeamType.Home));
  }

  function awayPoint() {
    dispatch(scorePoint(TeamType.Away));
  }

  function homeTeamTimeout() {
    dispatch(callTimeout(TeamType.Home));
  }

  function awayTeamTimeout() {
    dispatch(callTimeout(TeamType.Away));
  }

  function undo() {
    dispatch(undoLastEvent());
  }

  function toggleSettings() {
    // dispatch(callTimeout(Actor.AwayTeam));
  }

  function toggleInfo() {
    setInfoCollapse(!infoCollapse);
  }

  function returnCurrentTime() {
    return new Date().toLocaleTimeString();
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
                  border: 4, borderRadius: '12px', borderColor: 'primary.main',
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {getSet(match.events, TeamType.Home)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='right' sx={{
                  border: 6, borderRadius: '12px', borderColor: 'primary.main',
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {getScore(match.events, TeamType.Home)}
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
                  border: 6, borderRadius: '12px', borderColor: 'secondary.main',
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {getScore(match.events, TeamType.Away)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='center' sx={{
                  border: 4, borderRadius: '12px', borderColor: 'secondary.main',
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  {getSet(match.events, TeamType.Away)}
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
                width: 1, height: 84, backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.main' }
              }}>
              <Add sx={{ fontSize: 84 }} />
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button variant="contained" onClick={awayPoint}
              sx={{
                width: 1, height: 84, backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.main' }
              }}>
              <Add sx={{ fontSize: 84 }} />
            </Button>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button disabled={hasTakenTimeout(match.events, TeamType.Home)} onClick={homeTeamTimeout} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.main' }
              }}>
              <Typography sx={{ fontSize: 18 }}> TIMEOUT</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={hasTakenTimeout(match.events, TeamType.Away)} onClick={awayTeamTimeout} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.main' }

              }}>
              <Typography sx={{ fontSize: 18 }}> TIMEOUT</Typography>
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

function getScore(events: Event[], team: string) {
  let score = calculatePoints(events, TeamType.Home, TeamType.Away)
  console.log(score)
  return score[team]
}


function getSet(events: Event[], team: string) {
  let score = calculateSets(events, TeamType.Home, TeamType.Away)
  return score[team]
}

export function calculatePoints(events: Event[], homeTeam: string, awayTeam: string): { [key: string]: number } {
  const sets: { [key: string]: number } = { [homeTeam]: 0, [awayTeam]: 0 };
  let homeSetScore = [0, 0, 0];
  let awaySetScore = [0, 0, 0];
  let currentSet = 1;
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
          sets[homeTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[awayTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        }
      } else {
        if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          sets[homeTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
        } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[awayTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
        }
      }
    }
  });
  const currentSetScore = {
    [homeTeam]: homeSetScore[currentSet - 1],
    [awayTeam]: awaySetScore[currentSet - 1],
  };
  console.log(sets)
  return currentSetScore;
}

export function calculateSets(events: Event[], homeTeam: string, awayTeam: string): { [key: string]: number } {
  const sets: { [key: string]: number } = { [homeTeam]: 0, [awayTeam]: 0 };
  let homeSetScore = [0, 0, 0];
  let awaySetScore = [0, 0, 0];
  let currentSet = 1;
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
          sets[homeTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[awayTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        }
      } else {
        if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          sets[homeTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[awayTeam] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        }
      }
    }
  });
  return sets;
}

export function hasTakenTimeout(events: Event[], team: TeamType): boolean {
  const sets: { [key: string]: number } = { [TeamType.Home]: 0, [TeamType.Away]: 0 };
  let homeSetScore = [0, 0, 0];
  let awaySetScore = [0, 0, 0];
  let currentSet = 1;
  let hasTakenTimeout = false
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
          hasTakenTimeout = false
        } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[TeamType.Away] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
          hasTakenTimeout = false
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
    } else if (event.eventType === EventType.Timeout) {
      if (event.team === team) {
        hasTakenTimeout = true
      }
    }
  });
  return hasTakenTimeout;
}