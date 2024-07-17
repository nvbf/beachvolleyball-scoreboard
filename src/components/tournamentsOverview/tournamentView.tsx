import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Dialog, Typography } from "@mui/material";
import {
    QrCodeScanner,
    QrCode,
} from '@mui/icons-material';
import { getInitials } from "../../util/names";
import QRCode from "qrcode.react";
import { dateStringToString, getDelayString, getLateStart, timestampToString } from "../../util/time";
import { TeamType } from "../types";
import { Link } from "react-router-dom";

interface Tournament {
    endDate: string,
    startDate: string,
    name: string,
    slug: string,
    type: string,
    numberOfMatches: number | null,
    numberOfScoreboards: number | null,
}

interface TournamentViewProps {
    tournament: Tournament;
}

export function TournamentView({ tournament }: TournamentViewProps) {

    function getStatusColor(): string {
        // switch (state) {
        //     case MatchState.Reported:
        //         return "#FFEE93"
        //     case MatchState.Finished:
        //         return "#ADF7B6"
        //     case MatchState.Ongoing:
        return "#A0CED9"
        //     default:
        //         return "#FFC09F"
        // }
    }

    return (
        <Link
            to={'/tournament/' + tournament.slug}
            style={{ textDecoration: 'none', color: 'black' }}
        >
            <Box
                mb={3}
                key={tournament.slug}
                sx={{
                    border: 2,
                    borderLeftWidth: 10,
                    borderBottomWidth: 3,
                    marginBottom: 1,
                    marginLeft: 1,
                    marginRight: 1,
                    padding: 1,
                    borderImage: "linear-gradient(to left, " + getStatusColor() + ", black) 1",
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
                    <Grid item md={2} xs={12}>
                        <Typography
                            align="left"
                            sx={{
                                variant: "button",
                                lineHeight: 1,
                                paddingX: 1,
                            }}
                        > {tournament.startDate === tournament.endDate ? dateStringToString(tournament.startDate) : dateStringToString(tournament.startDate) + " - " + dateStringToString(tournament.endDate)}
                        </Typography>

                    </Grid>
                    <Grid item md={8} xs={12} sx={{ textAlign: "right" }}>

                        <Typography
                            align="left"
                            sx={{
                                variant: "button",
                                lineHeight: 1,
                                paddingTop: 1,
                                paddingX: 1,
                            }}
                        >
                            {tournament.name}
                        </Typography>
                    </Grid>
                    <Grid item md={2} xs={12} sx={{ textAlign: "right" }}>

                        <Typography
                            align="left"
                            sx={{
                                variant: "button",
                                lineHeight: 1,
                                paddingTop: 1,
                                paddingX: 1,
                            }}
                        >
                            Matches: {tournament.numberOfMatches}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Link>
    );
}

export default TournamentView;
