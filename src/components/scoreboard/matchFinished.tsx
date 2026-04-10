import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent, finalizeMatch } from "../../store/match/reducer";
import { finalizeMatchEvent } from "../eventFunctions";
import ScoreBox from "./scoreBox";


interface TeamColorPickerProps {
    team: TeamType;
}

export function MatchFinished() {

    const match = useAppSelector((state) => state.match);
    const dispatch = useAppDispatch();

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: finalizeMatchEvent(match.authUserId) }))
        dispatch(finalizeMatch())
    }

    return (
        <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            justifyContent="center"
            columns={12}
            marginTop={1}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
            <Grid size={12}>
                <Grid container
                    spacing={2}
                    columns={12}
                    justifyContent="center"
                // alignItems="flex-end"
                >
                    <ScoreBox score={match.currentSetScore[TeamType.Home]} color={match.teamColor[TeamType.Home]} size="large" />
                    <ScoreBox score={match.currentSetScore[TeamType.Away]} color={match.teamColor[TeamType.Away]} size="large" />
                </Grid>
            </Grid>
            {match.theCurrentSets.map((score, index) => (
                <Grid size={12} key={index}>
                    <Grid container
                        spacing={2}
                        columns={12}
                        justifyContent="center"
                        alignItems="flex-end"
                    >
                        <ScoreBox score={score[TeamType.Home]} color={match.teamColor[TeamType.Home]} size="small" />
                        <ScoreBox score={score[TeamType.Away]} color={match.teamColor[TeamType.Away]} size="small" />

                    </Grid>
                </Grid>
            ))}
            <Grid size={12}>
                <Typography sx={{ fontSize: 22 }}>The match is done! </Typography>
                <Typography sx={{ fontSize: 22 }}>Click on 'finalize' to finish.</Typography>
                <br></br>
                <Typography sx={{ fontSize: 22 }}>(Undo will be disabled when the match is finalized)</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'left' }}>
                <Button variant="contained" onClick={handleDone.bind(null)}
                    sx={{
                        width: 1, height: 64
                    }}>
                    <Typography sx={{ fontSize: 28 }}>
                        Finalize!
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default MatchFinished;