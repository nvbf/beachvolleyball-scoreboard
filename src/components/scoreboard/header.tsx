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
import { addPoint, scorePoint, callTimeout, undoLastEvent } from '../../store/match/actions';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { LeftMarginBox, VolleyAlert, VolleyAvatar, VolleyCard, VolleyCardHeader, VolleyRowStack, VolleyStack } from "../../util/styles";
import { TeamType, Event, EventType } from '../types';
import Grid from "@mui/material/Grid"
import Clock from "../clock";
import EventList from "../eventList";

export function ScoreboardHeader() {
  const match = useAppSelector((state) => state.match);

  const dispatch = useAppDispatch();
  const [infoCollapse, setInfoCollapse] = useState(false);

  function undo() {
    dispatch(undoLastEvent());
  }

  function toggleSettings() {
    // dispatch(callTimeout(Actor.AwayTeam));
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
            <Button variant="outlined" onClick={undo} sx={{ border: 2, borderRadius: '12px', color: 'black', borderColor: 'black' }}>
              <Undo sx={{ fontSize: 42 }} />
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography align='center' sx={{ fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
              <Clock format="24h" />
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Button variant="outlined" onClick={toggleSettings} sx={{ border: 2, borderRadius: '12px', color: 'black', borderColor: 'black' }}>
              <Settings sx={{ fontSize: 42 }} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ScoreboardHeader;