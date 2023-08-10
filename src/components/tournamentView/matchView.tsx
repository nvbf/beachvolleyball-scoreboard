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

interface MatchViewProps {
    match: AdminMatch;
    tournamentSlug: string
}

export function MatchView({ match, tournamentSlug }: MatchViewProps) {

    function getProfixioSets(sets: { [key: string]: number; }[], team: TeamType): number {
        let score = 0;

        sets.forEach(e => {
            if (team === TeamType.Home) {
                if (e["PointsHomeTeam"] > e["PointsAwayTeam"]) {
                    score++
                }
            } else {
                if (e["PointsHomeTeam"] < e["PointsAwayTeam"]) {
                    score++
                }
            }
        })
        return score
    }

    return (
        <Box
            mb={3}
            key={match.scoreboardID}
            sx={{
                border: 2,
                borderLeftWidth: 10,
                borderBottomWidth: 3,
                marginBottom: 1,
                padding: 1,
                borderImage: "linear-gradient(to right, " + getStatusColor(
                    getMatchState(match) === MatchState.Reported ? MatchState.Finished : getMatchState(match)
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
                                    fontWeight: (match.currentSetScore["HOME"] || 0) === 2 ? 'bold' : ""
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
                                    fontWeight: (match.currentSetScore["AWAY"] || 0) === 2 ? 'bold' : ""
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
                            {(match.hasWinner) && <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                <span key={"set"}>
                                    <b>{getProfixioSets(match.sets, TeamType.Home)}-{getProfixioSets(match.sets, TeamType.Away)}{' '}</b>
                                </span>
                                {match.sets.map((score: { [key: string]: number }, index: number) => (
                                    <span key={index}>
                                        ({score.PointsHomeTeam}-{score.PointsAwayTeam}){' '}
                                    </span>
                                ))}
                            </Typography>}
                            {(match.scoreboardID && match.currentScore && !match.hasWinner) && <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                <span key={"set"}>
                                    <b>{match.currentSetScore[TeamType.Home]}-{match.currentSetScore[TeamType.Away]}{' '}</b>
                                </span>
                                {match.currentScore.map((score: { [key: string]: number }, index: number) => (
                                    <span key={index}>
                                        ({score.HOME}-{score.AWAY}){' '}
                                    </span>
                                ))}
                            </Typography>}
                            {!(match.scoreboardID && match.currentScore || match.hasWinner) && <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                Ref: {match.referee}
                            </Typography>}
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MatchView;
