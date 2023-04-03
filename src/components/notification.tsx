import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from 'react';
import { useState } from "react";
import { clearNotification } from "../store/match/actions";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  RightBox,
  VolleyCard, VolleyCardHeader, VolleyRowStack
} from "../util/styles";
import { NotificationType } from "./types";


export function Notification() {
  const match = useAppSelector(state => state.match)

  return (
    <Box >
      <VolleyCard >
        <VolleyCardHeader
          title="Notification"
        />
        {match.switchSide && <SwitchSides />}
        {match.technicalTimeout && <TechnicalTimeout />}
        {match.teamTimeout && <TeamTimeout />}

        
      </VolleyCard>
    </Box >
  );
}

export function SwitchSides() {
  const dispatch = useAppDispatch()

  function clearSideSwitch() {
    dispatch(clearNotification(NotificationType.SwitchSides))
  }
  return (
    <VolleyRowStack
      direction="row"
      justifyContent="space-between"
      spacing={1}
      alignItems="center"
    >
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>Switch sides!</Typography>
      <RightBox sx={{ float: "right", padding: 2, paddingRight: 4 }}><Button onClick={clearSideSwitch} variant="contained" >Done</Button></RightBox >
    </VolleyRowStack>
  );
}


export function  TechnicalTimeout() {
  const dispatch = useAppDispatch()
  const match = useAppSelector(state => state.match)

  function clearTechnicalTimout() {
    dispatch(clearNotification(NotificationType.TechnicalTimeout))
  }

    return (
      <VolleyRowStack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        alignItems="center"
      >
        <Typography variant="h6" component="div" sx={{ padding: 2 }}>Technical timeout! </Typography>
        <RightBox sx={{ float: "right", padding: 2, paddingRight: 4 }}><Button onClick={clearTechnicalTimout} variant="contained" >Done</Button></RightBox >
      </VolleyRowStack>
    )
}

export function  TeamTimeout() {
  const dispatch = useAppDispatch()
  const match = useAppSelector(state => state.match)

  function clearTeamTimout() {
    dispatch(clearNotification(NotificationType.TeamTimeout))
  }

    return (
      <VolleyRowStack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        alignItems="center"
      >
        <Typography variant="h6" component="div" sx={{ padding: 2 }}>Team timeout! </Typography>
        <RightBox sx={{ float: "right", padding: 2, paddingRight: 4 }}><Button onClick={clearTeamTimout} variant="contained" >Done</Button></RightBox >
      </VolleyRowStack>
    )
}

export default Notification;
