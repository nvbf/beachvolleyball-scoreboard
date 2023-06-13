import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent, clearNotification, finalizeSet } from "../../store/match/actions";
import { finalizeSetEvent } from "./eventFunctions";


interface TeamColorPickerProps {
    team: TeamType;
}

export function SetFinished() {
    const match = useAppSelector((state) => state.match);
    const dispatch = useAppDispatch();

    function handleDone() {
        dispatch(clearNotification());
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: finalizeSetEvent() }))
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
            <Grid item xs={12} sm={8} md={6}>
                <Grid container
                    spacing={2}
                    columns={12}
                    justifyContent="center"
                // alignItems="flex-end"
                >
                    <Grid item >
                        <Typography align='right' sx={{
                            border: 6, borderRadius: '12px', borderColor: match.teamColor[TeamType.Home],
                            fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                            paddingX: 1, minWidth: 50
                        }}>
                            {match.theCurrentSets[match.currentSet - 2][TeamType.Home]}
                        </Typography>

                    </Grid>
                    <Grid item>
                        <Typography align='left' sx={{
                            border: 6, borderRadius: '12px', borderColor: match.teamColor[TeamType.Away],
                            fontSize: "3.5rem", variant: 'button', lineHeight: 1, paddingTop: 3,
                            paddingX: 1, minWidth: 50
                        }}>
                            {match.theCurrentSets[match.currentSet - 2][TeamType.Away]}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{ fontSize: 22 }}>The set is done! </Typography>
                <Typography sx={{ fontSize: 22 }}>Click on 'finalize' to finish.</Typography>
                <br></br>
                <Typography sx={{ fontSize: 22 }}>(You will no longer be able to undo the events in this set)</Typography>
            </Grid>
            <Grid item md={6} xs={12} sx={{ textAlign: 'left' }}>
                <Button variant="contained" onClick={handleDone.bind(null)}
                    sx={{
                        width: 1, height: 64
                    }}>
                    <Typography sx={{ fontSize: 22 }}>
                        finalize!
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default SetFinished;