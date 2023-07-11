import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Dialog, Typography } from "@mui/material";
import {
    QrCodeScanner,
    QrCode,
} from '@mui/icons-material';
import { getInitials } from "../../util/names";
import { AdminMatch, MatchState } from "./types";
import QRCode from "qrcode.react";
import { getDelayString, getLateStart, timestampToString } from "../../util/time";
import { getMatchState, getStatusColor } from "./adminMatchFunctions";
import { TeamType } from "../types";

interface MatchViewProps {
    match: AdminMatch;
    tournamentSlug: string
}

export function MatchView({ match, tournamentSlug }: MatchViewProps) {
    const [open, setOpen] = useState(false);
    const [activeQrCode, setActiveQrCode] = useState("");

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = (url: React.SetStateAction<string>) => {
        setActiveQrCode(url);
        setOpen(true);
    };

    const url = match.scoreboardID ? `https://${window.location.hostname
        }/match/${match.scoreboardID}` : `https://${window.location.hostname
        }/match?name1=${encodeURIComponent(match.homeTeam.player1)
    }&name2=${encodeURIComponent(match.homeTeam.player2)
    }&name3=${encodeURIComponent(match.awayTeam.player1)
    }&name4=${encodeURIComponent(match.awayTeam.player2)
    }&matchId=${match.matchId}&tournamentId=${tournamentSlug}`;
    ("");

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
                marginBottom: 2,
                borderImage: "linear-gradient(to right, " + getStatusColor(getMatchState(match)) + ", black) 1",
                // borderLeftWidth: 10,
            }}
        >
            <Grid
                container
                spacing={0}
                rowSpacing={0}
                columns={12}
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Grid item md={11} xs={10} sx={{ textAlign: "right" }}>
                    <Grid
                        container
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="center"
                        columns={12}
                    >
                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
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


                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
                            {(match.hasWinner) && <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                <span key={"set"}>
                                    <b>{getProfixioSets(match.sets, TeamType.Away)}-{getProfixioSets(match.sets, TeamType.Home)}{' '}</b>
                                </span>
                                {match.sets.map((score: { [key: string]: number }, index: number) => (
                                    <span key={index}>
                                        ({score.PointsAwayTeam}-{score.PointsHomeTeam}){' '}
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
                <Grid item md={1} xs={2} sx={{ textAlign: "right" }}>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="outlined"
                            sx={{
                                border: 0, borderRadius: '12px', color: 'black', borderColor: 'black',
                                '&:hover': {
                                    border: 0, borderRadius: '12px', color: 'black', borderColor: 'black', backgroundColor: "gray"
                                }
                            }}
                            onClick={() => handleOpen(url)}
                        >
                            {!match.scoreboardID && <QrCodeScanner sx={{ fontSize: 64 }} />}
                            {match.scoreboardID && <QrCode sx={{ fontSize: 64 }} />}

                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <Box p={3}>
                    <QRCode value={activeQrCode} size={Math.min(512, window.outerWidth - 100)} />
                </Box>
            </Dialog>
        </Box>
    );
}

export default MatchView;
