import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Dialog, Typography } from "@mui/material";
import {
    QrCodeScanner,
    QrCode,
} from '@mui/icons-material';
import { getInitials } from "../../util/names";
import { AdminMatch } from "./types";
import QRCode from "qrcode.react";
import { timestampToString } from "../../util/time";

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

    const awayTeamName = match.awayTeam?.name?.replace(/^\#\d+\s/, "");
    const homeTeamName = match.homeTeam?.name?.replace(/^\#\d+\s/, "");
    const [name1, name2] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
    const [name3, name4] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];

    const url = match.scoreboardID ? `https://${window.location.hostname
        }/match/${match.scoreboardID}` : `https://${window.location.hostname
        }/match?name1=${encodeURIComponent(name1.trim())}&name2=${encodeURIComponent(
            name2.trim()
        )}&name3=${encodeURIComponent(name3.trim())}&name4=${encodeURIComponent(
            name4.trim()
        )}&matchId=${match.matchId}&tournamentId=${tournamentSlug}`;
    ("");

    return (
        <Box
            mb={3}
            key={match.scoreboardID}
            sx={{
                border: 2,
                borderLeftWidth: 10,
                borderBottomWidth: 3,
                borderImage: "linear-gradient(to right, " + getStatusColor(match) + ", black) 1",
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
                                }}
                            >
                                {getInitials(name1)} / {getInitials(name2)}
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
                                {getInitials(name3)} / {getInitials(name4)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {(match.scoreboardID && match.currentScore) && <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                <span key={"set"}>
                                    <b>{match.currentSetScore["HOME"]}-{match.currentSetScore["AWAY"]}{' '}</b>
                                </span>
                                {match.currentScore.map((score: { [key: string]: number }, index: number) => (
                                    <span key={index}>
                                        ({score.HOME}-{score.AWAY}){' '}
                                    </span>
                                ))}
                            </Typography>}
                            {!(match.scoreboardID && match.currentScore) && <Typography align='left' sx={{
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

    function getStatusColor(match: AdminMatch): string {
        if (match.hasWinner) {
            return "#FFEE93"
        } else if (match.isFinalized) {
            return "#ADF7B6"
        } else if (match.isStarted) {
            return "#A0CED9"
        } else {
            return "#FFC09F"
        }
    }
}

export default MatchView;
