import {
  Undo,
  Settings
} from '@mui/icons-material';
import {
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { undoEvent } from '../../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Grid from "@mui/material/Grid"
import Clock from "../clock";
import { createUndoEvent, getLastValidEvent } from "../eventFunctions";
import { EventType } from '../types';
import TimeElapsed from '../timeElaped';
import logo from '../../osvb_logo_hi_res.png';

export function ScoreboardHeader() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();

  function undo() {
    dispatch(undoEvent({ matchId: match.matchId, id: match.id, event: createUndoEvent(match.events, match.authUserId) }));
  }

  function toggleSettings() {
    // dispatch(callTimeout(Actor.AwayTeam));
  }

  function disableUndo(events: import("../types").Event[]): boolean {
    if (getLastValidEvent(match.events)?.eventType === EventType.SetFinalized) {
      return true
    }
    if (getLastValidEvent(match.events)?.eventType === EventType.MatchFinalized) {
      return true
    }
    return false
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
          <Grid item xs={3} >
            <Button variant="outlined" disabled={disableUndo(match.events)} onClick={undo} sx={{ border: 2, borderRadius: '12px', color: 'black', borderColor: 'black' }}>
              <Undo sx={{ fontSize: 42 }} />
            </Button>
          </Grid>
          {!match.userMessage && <Grid item xs={6}>
            <Typography align='center' sx={{ fontSize: "3rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              <TimeElapsed startTime={match.startTime} />
            </Typography>
          </Grid>}
          {match.userMessage && !match.finished && <Grid item xs={6}>
            <Typography align='center' sx={{ fontSize: "1.2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              NEXT POINT:
            </Typography>
            <Typography align='center' sx={{ fontSize: "1.2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              {match.userMessage.toUpperCase()}
            </Typography>
          </Grid>}
          {(getLastValidEvent(match.events)?.eventType === EventType.MatchFinalized || false) && <Grid item xs={6}>
            <Typography align='center' sx={{ fontSize: "1.2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              {"match done!".toUpperCase()}
            </Typography>
            <Typography align='center' sx={{ fontSize: "1.2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              {"thank you!".toUpperCase()}
            </Typography>
          </Grid>}
          <Grid item xs={3}>
            <img src={logo} alt="logo" style={{ height: '3rem' }} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ScoreboardHeader;
