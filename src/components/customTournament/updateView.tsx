import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Dialog, Typography } from "@mui/material";
import {
    QrCodeScanner,
    QrCode,
} from '@mui/icons-material';
import { getInitials } from "../../util/names";
import { AdminMatch, MatchState } from "../tournamentAdmin/types";
import QRCode from "qrcode.react";
import { getDelayString, getLateStart, timestampToString } from "../../util/time";
import { TeamType } from "../types";
import { getMatchState, getStatusColor } from "../tournamentAdmin/adminMatchFunctions";

interface UpdateViewProps {
    existingMatch: AdminMatch | null;
    newMatch: AdminMatch    
}

export function UpdateView({ newMatch, existingMatch }: UpdateViewProps) {
    return (
        <div>
            {!compareAdminMatches(newMatch, existingMatch) && <div>New values:</div>}
            {!compareAdminMatches(newMatch, existingMatch) && showMatch(newMatch, newMatch.matchId+"-new")}
            {!compareAdminMatches(newMatch, existingMatch) && <div>Old values:</div>}
            {!compareAdminMatches(newMatch, existingMatch) && existingMatch && showMatch(existingMatch, newMatch.matchId+"-old")}
        </div>
    );
}

const compareAdminMatches = (match1: AdminMatch, match2: AdminMatch | null): boolean => {
    if (!match2){
        return false
    }
    return (
        match1.matchId === match2.matchId &&
        match1.awayTeam.name === match2.awayTeam.name &&
        match1.awayTeam.player1 === match2.awayTeam.player1 &&
        match1.awayTeam.player2 === match2.awayTeam.player2 &&
        match1.startTime === match2.startTime &&
        match1.arenaName === match2.arenaName &&
        match1.referee === match2.referee &&
        match1.homeTeam.name === match2.homeTeam.name &&
        match1.homeTeam.player1 === match2.homeTeam.player1 &&
        match1.homeTeam.player2 === match2.homeTeam.player2 &&
        match1.matchCategory === match2.matchCategory &&
        match1.matchGroup === match2.matchGroup &&
        match1.name === (match2.name || "")
    );
}

const showMatch = (match: AdminMatch, key: string) => {
    return (<Box
    mb={3}
    key={key}
    sx={{
        border: 2,
        borderLeftWidth: 10,
        borderBottomWidth: 3,
        marginBottom: 1,
        padding: 1,
        borderImage: "linear-gradient(to right, " + getStatusColor(
            MatchState.Upcoming
        ) + ", black) 1",
        // borderLeftWidth: 10,
    }}
>
    <Grid
        container
        spacing={0}
        rowSpacing={0}
        columns={12}
        marginBottom={0}
        justifyContent="space-evenly"
        alignItems="center"
    >
        <Grid item md={8} xs={12} sx={{ textAlign: "left" }}>
            <Grid
                container
                spacing={0}
                justifyContent="flex-end"
                alignItems="center"
                columns={12}
                padding={0}
                marginBottom={0}
            >
                <Grid item md={6} xs={8}>
                    <Typography
                        align="left"
                        sx={{
                            variant: "button",
                            lineHeight: 1,
                            paddingX: 1,
                        }}
                    >
                        #{match.matchId} | {timestampToString(match.startTime)}
                        {(getMatchState(match) === MatchState.Upcoming) && getDelayString(match.startTime)}
                        {(getMatchState(match) === MatchState.Ongoing) && getLateStart(match.startTime, match.startTimestamp)}

                    </Typography>

                </Grid>
                <Grid item md={6} xs={4}>
                    <Typography
                        align="left"
                        sx={{
                            variant: "button",
                            lineHeight: 1,
                            paddingTop: 1,
                            paddingX: 1,
                        }}
                    >
                        {match.matchCategory + " - " + (match.matchGroup !== "" ? (" Group " + match.matchGroup) : match.name)}
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6}>
                    <Typography
                        align="left"
                        sx={{
                            variant: "button",
                            lineHeight: 1,
                            paddingTop: 1,
                            paddingX: 1,
                        }}
                    >
                        {getInitials(match.homeTeam.player1)} / {getInitials(match.homeTeam.player2)}
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6}>
                    <Typography
                        align="left"
                        sx={{
                            variant: "button",
                            lineHeight: 1,
                            paddingTop: 1,
                            paddingX: 1,
                        }}
                    >
                        {getInitials(match.awayTeam.player1)} / {getInitials(match.awayTeam.player2)}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid item md={4} xs={12} sx={{ textAlign: "right" }}>
            <Grid
                container
                spacing={0}
                justifyContent="flex-end"
                alignItems="center"
                columns={12}
                marginBottom={0}
                padding={0}
            >
                <Grid item md={12} xs={4}>
                    <Typography
                        align="left"
                        sx={{
                            variant: "button",
                            lineHeight: 1,
                            paddingTop: 1,
                            paddingX: 1,
                        }}
                    >
                        {match.arenaName}
                    </Typography>
                </Grid>
                <Grid item md={12} xs={8}>
                    {<Typography align='left' sx={{
                        variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                    }}>
                        Ref: {match.referee}
                    </Typography>}
                </Grid>

            </Grid>
        </Grid>
    </Grid>
</Box>)

}

export default UpdateView;
