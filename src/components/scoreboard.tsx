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
  Typography
} from "@mui/material";
import { useAppSelector } from '../store/store';
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import { getInitials } from "../util/names";
import { matchState } from "../store/types";

export function Scoreboard() {
  const match = useAppSelector((state) => state.match);

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
