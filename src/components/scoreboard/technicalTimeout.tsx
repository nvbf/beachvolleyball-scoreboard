import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent } from "../../store/match/actions";
import { pickTeamColorEvent, setClearMessageEvent } from "../eventFunctions";
import TimeElapsed from "../timeElaped";


interface TechnicalTimeoutProps {
    startTime: number;
}

export function TechnicalTimeout({ startTime }: TechnicalTimeoutProps) {

    const dispatch = useAppDispatch();
    const match = useAppSelector((state) => state.match);

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setClearMessageEvent() }))
    }

    return (
        <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            justifyContent="center"
            columns={12}
            marginTop={4}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
            <Grid item xs={12}>
                <Typography sx={{ fontSize: 28 }}>Technical timeout</Typography>
            </Grid>
            <Typography align='center' sx={{ fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
                <TimeElapsed startTime={startTime} />
            </Typography>
            <Grid item md={6} xs={12} sx={{ textAlign: 'left' }}>
                <Button variant="contained" onClick={handleDone.bind(null)}
                    sx={{
                        width: 1, height: 64
                    }}>
                    <Typography>
                        Done!
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

export default TechnicalTimeout;