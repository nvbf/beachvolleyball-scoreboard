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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import { addPoint, scorePoint, callTimeout } from '../store/match/actions';
import { useAppDispatch, useAppSelector } from '../store/store';
import { LeftMarginBox, VolleyAlert, VolleyAvatar, VolleyCard, VolleyCardHeader, VolleyRowStack, VolleyStack } from "../util/styles";
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import Clock from "./clock";
import EventList from "./eventList";




interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
    // dispatch(callTimeout(Actor.AwayTeam));
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
      <Grid item xs={12}>
        <Grid container
          spacing={2}
          columns={12}
          sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
          <Grid item xs={4} >
            <Button variant="outlined" onClick={undo} sx={{ border: 2, borderRadius: '12px', color: 'black', borderColor: 'black' }}>
              <Undo sx={{ fontSize: 52 }} />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography align='center' sx={{ fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              <Clock format="24h" />
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={toggleSettings} sx={{ border: 2, borderRadius: '12px', color: 'black', borderColor: 'black' }}>
              <Settings sx={{ fontSize: 52 }} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
                  0
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='right' sx={{
                  border: 6, borderRadius: '12px', borderColor: 'primary.main',
                  fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                  paddingX: 1, minWidth: 50
                }}>
                  {match.sets[0].homeTeamScore}
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
                  {match.sets[0].awayTeamScore}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='center' sx={{
                  border: 4, borderRadius: '12px', borderColor: 'secondary.main',
                  fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1,
                  paddingX: 1
                }}>
                  0
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
            <Typography sx={{ fontSize: 18 }}> {match.homeTeam.player1Name} <SportsVolleyball sx={{ fontSize: 18, display: "none" }} /></Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 18 }}> <SportsVolleyball sx={{ fontSize: 18, display: "none" }} /> {match.awayTeam.player1Name}</Typography>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 18 }}> {match.homeTeam.player2Name} <SportsVolleyball sx={{ fontSize: 18, display: "none" }} /></Typography>

          </Grid>

          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontSize: 18 }}> <SportsVolleyball sx={{ fontSize: 18, display: "none" }} /> {match.awayTeam.player2Name}</Typography>
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
            <Button disabled={match.homeTimeout} onClick={homeTeamTimeout} variant="contained"
              sx={{
                width: 1, textTransform: 'none', backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.main' }
              }}>
              <Typography sx={{ fontSize: 18 }}> TIMEOUT</Typography>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left' }}>
            <Button disabled={match.awayTimeout} onClick={awayTeamTimeout} variant="contained"
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

export const getPointsByTeam = (events: Event[], team: TeamType): number => {
  let points = 0;
  let servingTeam = TeamType.Home;
  let servingPlayer = 1;
  let lastEventType: EventType;

  events.forEach((event) => {
    // check if the event was undone
    if (event.undone) {
      // if the event was undone, revert the score and serving team/player
      if (lastEventType === EventType.Score) {
        points -= 1;
      }
      servingTeam = event.team;
      servingPlayer = event.playerId;
    } else {
      // check the event type and update the score and serving team/player
      switch (event.eventType) {
        case EventType.Score:
          if (event.team === team) {
            points += 1;
          }
          servingTeam = event.team;
          servingPlayer = event.playerId;
          break;
        case EventType.FirstPlayerServer:
          if (event.playerId !== servingPlayer) {
            servingTeam = event.team;
            servingPlayer = event.playerId;
          }
          break;
        case EventType.FirstTeamServer:
          servingTeam = event.team;
          servingPlayer = event.playerId;
          break;
      }
      lastEventType = event.eventType;
    }
  });

  return points;
};

export function calculateSets(events: Event[], homeTeam: string, awayTeam: string): { [key: string]: number } {
  const sets: { [key: string]: number } = { [homeTeam]: 0, [awayTeam]: 0 };
  let homeScore = 0;
  let awayScore = 0;
  events.forEach((event) => {
    if (event.undone) {
      return;
    }
    if (event.eventType === EventType.Score) {
      if (event.team === TeamType.Home) {
        homeScore += 1;
      } else {
        awayScore += 1;
      }
      if (homeScore >= 21 && homeScore - awayScore >= 2) {
        sets[homeTeam] += 1;
        homeScore = 0;
        awayScore = 0;
      } else if (awayScore >= 21 && awayScore - homeScore >= 2) {
        sets[awayTeam] += 1;
        homeScore = 0;
        awayScore = 0;
      }
    }
  });
  return sets;
}

export function calculatePointsAndSets(events: Event[], homeTeam: string, awayTeam: string): { [key: string]: number } {
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
    }
  });
  const currentSetScore = {
    [homeTeam]: homeSetScore[currentSet - 1],
    [awayTeam]: awaySetScore[currentSet - 1],
  };
  return { ...sets, ...currentSetScore };
}
