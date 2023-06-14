import React, { useState } from "react";
import { EventType, TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent } from "../../store/match/actions";
import TimeElapsed from "../timeElaped";
import { setClearMessageEvent } from "../eventFunctions";


interface TeamTimeoutProps {
    team: TeamType;
}

export function TeamTimeout({ team }: TeamTimeoutProps) {

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
                <Typography sx={{ fontSize: 28 }}>The {team === TeamType.Home ? "home" : "away"} team called for a timeout</Typography>
            </Grid>
            <Typography align='center' sx={{ fontSize: "2rem", variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1 }}>
                <TimeElapsed startTime={match.events.slice().reverse().find(e => e.eventType === EventType.Timeout && !e.undone)?.timestamp || 0} />
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

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default TeamTimeout;