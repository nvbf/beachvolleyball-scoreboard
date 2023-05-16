import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent, clearNotification } from "../../store/match/actions";
import { pickTeamColorEvent } from "./eventFunctions";


interface TeamTimeoutProps {
    team: TeamType;
}

export function TeamTimeout({ team }: TeamTimeoutProps) {

    const dispatch = useAppDispatch();

    function handleDone() {
        dispatch(clearNotification());
    }

    return (
        <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            justifyContent="center"
            columns={12}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
            <Grid item xs={12}>
                <Typography sx={{ fontSize: 28 }}>Team timout for the {team === TeamType.Home ? "home" : "away"} team</Typography>
            </Grid>
        </Grid>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default TeamTimeout;