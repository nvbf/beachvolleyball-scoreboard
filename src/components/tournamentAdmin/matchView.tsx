import React, { useState } from "react";
import { Match, TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ChromePicker } from "react-color";
import {
    Abc,
} from '@mui/icons-material';
import { getTextColorFromBackground } from "../../util/color";
import { addEvent, setTeamColor } from "../../store/match/actions";
import { getInitials } from "../../util/names";


interface MatchViewProps {
    match: Match;
}

export function TeamColorPicker({ match }: MatchViewProps) {

    return (
        <Box mb={3} key={match.matchId} sx={{
            border: 2, borderRadius: '12px', borderColor: 'black'
        }} >
            <Grid container
                spacing={2}
                columns={12}
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Grid item md={10} xs={8} sx={{ textAlign: 'right' }}>
                    <Grid container
                        spacing={2}
                        justifyContent="flex-end"
                        alignItems="center"
                        columns={12}
                    >
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {match.Field.Name}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                Match: {match.Number}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {match.Time}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {match.Date}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {getInitials(name1)} / {getInitials(name2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {getInitials(name3)} / {getInitials(name4)}
                            </Typography>
                        </Grid>

                        {(match.ScoreboardId && match.CurrentScore) && <Grid item xs={12}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                <span key={"set"}>
                                    <b>{match.CurrentSetScore["HOME"]}-{match.CurrentSetScore["AWAY"]}{' '}</b>
                                </span>
                                {currentScore.map((score, index) => (
                                    <span key={index}>
                                        ({score.HOME}-{score.AWAY}){' '}
                                    </span>
                                ))}
                            </Typography>
                        </Grid>}
                    </Grid>
                </Grid>
                <Grid item md={2} xs={4} sx={{ textAlign: 'right' }}>
                    <Box display="flex" justifyContent="center" p={1}>
                        <QRCode value={url} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpen(url)}
                        >
                            Expand QR
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default TeamColorPicker;