import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent } from "../../store/match/reducer";
import { finalizeMatchEvent } from "../eventFunctions";
import { getInitials } from "../../util/names";
import { getPlayer } from "../scoreboard";
import { ScoreBox } from "./scoreBox";


interface TeamColorPickerProps {
    team: TeamType;
}

export function MatchFinalized() {

    const match = useAppSelector((state) => state.match);

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
                    columnSpacing={2}
                    columns={12}
                    sx={{ alignSelf: 'center', textAlign: 'center' }}
                >
                    <Grid size={6} sx={{ textAlign: 'right' }}>
                        <Typography sx={{
                            fontSize: 18,
                            fontWeight: (match.currentSetScore[TeamType.Home] || 0) === 2 ? 'bold' : ""

                        }}> {getInitials(getPlayer(match, 1, TeamType.Home))} / {getInitials(getPlayer(match, 2, TeamType.Home))}</Typography>
                    </Grid>

                    <Grid size={6} sx={{ textAlign: 'left' }}>
                        <Typography sx={{
                            fontSize: 18,
                            fontWeight: (match.currentSetScore[TeamType.Away] || 0) === 2 ? 'bold' : ""

                        }}> {getInitials(getPlayer(match, 1, TeamType.Away))} / {getInitials(getPlayer(match, 2, TeamType.Away))}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Grid container
                    columnSpacing={2}
                    columns={12}
                    sx={{ alignSelf: 'center', textAlign: 'center' }}
                >

                    <Grid size={12} sx={{ textAlign: 'center' }}>
                        <Typography sx={{
                            fontSize: 18,
                            fontWeight: (match.currentSetScore[TeamType.Away] || 0) === 2 ? 'bold' : ""

                        }}> Match: #{match.matchId}</Typography>
                    </Grid>
                </Grid>
            </Grid>
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
        </Grid>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default MatchFinalized;