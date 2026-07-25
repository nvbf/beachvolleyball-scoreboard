import {
  ArrowForwardIos,
  ArrowBackIosNew
} from '@mui/icons-material';
import {
  Box,
  Typography
} from "@mui/material";
import { useAppSelector } from '../store/store';
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import { getInitials } from "../util/names";
import { matchState } from "../store/types";
import { ScoreBox } from "./scoreboard/scoreBox";

export function Scoreboard() {
  const match = useAppSelector((state) => state.match);
  const leftTeam = getLeftTeam(match);
  const rightTeam = getRightTeam(match);
  const leftColor = match.teamColor[leftTeam];
  const rightColor = match.teamColor[rightTeam];

  return (
    <Grid container
      justifyContent="center"
      alignItems="center"
      rowSpacing={0}
      spacing={1.5}
      columns={12}
      marginTop={0.5}
    >
      <Grid size={12}>
        <Grid container
          spacing={1}
          columns={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid size={6} sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1.25 }}>
              <ScoreBox score={match.currentSetScore[leftTeam]} color={leftColor} size="small" />
              <ScoreBox score={match.currentScore[leftTeam]} color={leftColor} size="large" />
            </Box>
          </Grid>
          <Grid size={6} sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25 }}>
              <ScoreBox score={match.currentScore[rightTeam]} color={rightColor} size="large" />
              <ScoreBox score={match.currentSetScore[rightTeam]} color={rightColor} size="small" />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container
          columnSpacing={0}
          columns={13}
          sx={{ alignSelf: 'center', textAlign: 'center', marginTop: 1.25 }}
        >
          <Grid size={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{
              fontSize: 18,
              fontWeight: (getServer(match.events, leftTeam) === 1) ? "bold" : "normal",
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              textDecoration: (getServer(match.events, leftTeam) === 1) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 1, leftTeam))} </Typography>
          </Grid>
          <Grid size={1} sx={{ color: '#1c1c1e' }}>
            {(getServer(match.events, rightTeam) === 1) && <ArrowForwardIos sx={{ fontSize: 16 }} />}
            {(getServer(match.events, leftTeam) === 1) && <ArrowBackIosNew sx={{ fontSize: 16 }} />}
          </Grid>
          <Grid size={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{
              fontSize: 18,
              fontWeight: (getServer(match.events, rightTeam) === 1) ? "bold" : "normal",
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              textDecoration: (getServer(match.events, rightTeam) === 1) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 1, rightTeam))}</Typography>
          </Grid>

          <Grid size={6} sx={{ textAlign: 'right' }}>
            <Typography sx={{
              fontSize: 18,
              fontWeight: (getServer(match.events, leftTeam) === 2) ? "bold" : "normal",
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              textDecoration: (getServer(match.events, leftTeam) === 2) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 2, leftTeam))}</Typography>

          </Grid>
          <Grid size={1} sx={{ color: '#1c1c1e' }}>
            {(getServer(match.events, leftTeam) === 2) && <ArrowBackIosNew sx={{ fontSize: 16 }} />}
            {(getServer(match.events, rightTeam) === 2) && <ArrowForwardIos sx={{ fontSize: 16 }} />}
          </Grid>
          <Grid size={6} sx={{ textAlign: 'left' }}>
            <Typography sx={{
              fontSize: 18,
              fontWeight: (getServer(match.events, rightTeam) === 2) ? "bold" : "normal",
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              textDecoration: (getServer(match.events, rightTeam) === 2) ? "underline" : "none"
            }}> {getInitials(getPlayer(match, 2, rightTeam))}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Scoreboard;

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
  let firstSwitch = true;

  events.forEach((event) => {
    // check if the event was undone
    if (!event.undone) {
      // check the event type and update the score and serving team/player
      switch (event.eventType) {
        case EventType.Score:
          if (lastServingTeam !== event.team) {
            servingTeam = event.team
            if (firstSwitch) {
              firstSwitch = false
            } else {
              if (servingTeam !== team) {
                break;
              }
              servingPlayer = lastServingPlayer === 1 ? 2 : 1
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
          firstSwitch = true;
          break;
      }
      lastServingTeam = servingTeam;
      lastServingPlayer = servingPlayer
    }
  });

  if (servingTeam === team) {
    return servingPlayer
  } else {
    return 0
  }
};
