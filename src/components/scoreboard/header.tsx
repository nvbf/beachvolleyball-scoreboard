import {
  Undo
} from '@mui/icons-material';
import {
  IconButton,
  Typography
} from "@mui/material";
import React from 'react';
import { undoEvent } from '../../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Grid from "@mui/material/Grid"
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
      spacing={0}
      columns={12}
    >
      <Grid size={12} sx={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#e6dece', borderRadius: '12px', paddingTop: 0.5, paddingBottom: 1.5 }}>
        <Grid container
          spacing={0}
          columns={12}
          sx={{ alignSelf: 'center', textAlign: 'center', alignItems: 'center' }}
        >
          <Grid size={3} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <IconButton disabled={disableUndo(match.events)} onClick={undo} sx={{ width: 48, height: 48, border: '2px solid #1c1c1e', borderRadius: '12px', color: '#1c1c1e', '&.Mui-disabled': { borderColor: 'rgba(28,28,30,0.25)' } }}>
              <Undo sx={{ fontSize: 30 }} />
            </IconButton>
          </Grid>
          {!match.userMessage && <Grid size={6}>
            <Typography align='center' sx={{ fontSize: '2.8rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
              <TimeElapsed startTime={match.startTime} />
            </Typography>
          </Grid>}
          {match.userMessage && !match.finished && <Grid size={6}>
            <Typography align='center' sx={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2, color: '#5a5a5f', letterSpacing: '0.06em' }}>
              NEXT POINT:
            </Typography>
            <Typography align='center' sx={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.1, paddingTop: 0.75 }}>
              {match.userMessage.toUpperCase()}
            </Typography>
          </Grid>}
          {(getLastValidEvent(match.events)?.eventType === EventType.MatchFinalized || false) && <Grid size={6}>
            <Typography align='center' sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
              {"match done!".toUpperCase()}
            </Typography>
            <Typography align='center' sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2, paddingTop: 0.25 }}>
              {"thank you!".toUpperCase()}
            </Typography>
          </Grid>}
          <Grid size={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <img src={logo} alt="OSVB logo" style={{ height: '48px', width: 'auto' }} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ScoreboardHeader;
