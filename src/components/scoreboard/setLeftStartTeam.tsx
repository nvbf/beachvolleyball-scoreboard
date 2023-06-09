import AddIcon from "@mui/icons-material/Add";
import {
    SwapHoriz,
    SportsVolleyball,
    Undo,
    Settings
} from '@mui/icons-material';
import {
    Box,
    CardActions,
    ThemeProvider,
    Typography,
    createTheme,
    responsiveFontSizes
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { addEvent } from '../../store/match/actions';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType, Event, EventType } from '../types';
import Grid from "@mui/material/Grid"
import EventList from "../eventList";
import { getInitials } from "../../util/names";
import { getBackgroundColor, getTextColor, selectFirstServerEvent, selectFirstServingTeamEvent } from "../scoreboard/eventFunctions";
import { matchState } from "../../store/types";
import { setLeftStartTeamEvent } from "../scoreboard/eventFunctions";
import { setNoSideSwitchEvent } from "../scoreboard/eventFunctions";
import { getTextColorFromBackground } from "../../util/color";

export function SetLeftStartTeam() {
    const match = useAppSelector((state) => state.match);
    const [leftSideTeam, setLeftSideTeam] = useState(TeamType.Home);

    const dispatch = useAppDispatch();

    function setLeftTeam() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setLeftStartTeamEvent(leftSideTeam) }));
    }

    function setNoSideSwitch() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setNoSideSwitchEvent() }));
    }

    function handleSwitch() {
        if (leftSideTeam === TeamType.Home) {
            setLeftSideTeam(TeamType.Away)
        } else {
            setLeftSideTeam(TeamType.Home)
        }
    }

    const getRightTeam = (): TeamType => {
        if (leftSideTeam === TeamType.Home) {
            return TeamType.Away
        } else {
            return TeamType.Home
        }
    }

    const getLeftTeam = (): TeamType => {
        return leftSideTeam
    }

    const getPlayer = (match: matchState, playerId: number, teamType: TeamType): string => {
        if (teamType === TeamType.Home) {
            if (playerId === 1) {
                return match.homeTeam.player1Name
            } else {
                return match.homeTeam.player2Name
            }
        } else {
            if (playerId === 1) {
                return match.awayTeam.player1Name
            } else {
                return match.awayTeam.player2Name
            }
        }
    }

    let theme = createTheme();
    theme = responsiveFontSizes(theme);
    theme.typography.h6 = {
        fontWeight: 'normal',
        fontSize: '1.0rem',
        '@media (min-width:600px)': {
            fontSize: '1.4rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.6rem',
        },
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container
                justifyContent="center"
                alignItems="center"
                rowSpacing={0}
                spacing={2}
                columns={12}
            >
                <Grid item xs={12}>

                    <Grid container
                        columnSpacing={2}
                        rowSpacing={2}
                        justifyContent="center"
                        columns={12}
                        sx={{ alignSelf: 'center', textAlign: 'center' }}
                    >
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Typography variant="h4"> Choose team sides</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container
                                columnSpacing={2}
                                rowSpacing={2}
                                columns={12}
                                justifyContent="center"
                                sx={{ alignSelf: 'center', textAlign: 'center' }}
                            >
                                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                                    <Button variant="outlined" sx={{ width: 1, border: 2, borderRadius: '12px', color: 'black', borderColor: 'black' }}
                                        onClick={handleSwitch.bind(null)}>
                                        <SwapHoriz sx={{ fontSize: 64 }} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Button variant="contained"
                                sx={{
                                    width: 1, height: 96, backgroundColor: match.teamColor[getLeftTeam()],
                                    '&:hover': { backgroundColor: match.teamColor[getLeftTeam()] }
                                }}>
                                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[getLeftTeam()]) }}>
                                    <Box>{getInitials(getPlayer(match, 1, getLeftTeam()))}</Box>
                                    <Box>{getInitials(getPlayer(match, 2, getLeftTeam()))}</Box>
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Button variant="contained"
                                sx={{
                                    width: 1, height: 96, backgroundColor: match.teamColor[getRightTeam()],
                                    '&:hover': { backgroundColor: match.teamColor[getRightTeam()] }
                                }}>
                                <Typography variant="h6" sx={{ color: getTextColorFromBackground(match.teamColor[getRightTeam()]) }}>
                                    <Box>{getInitials(getPlayer(match, 1, getRightTeam()))}</Box>
                                    <Box>{getInitials(getPlayer(match, 2, getRightTeam()))}</Box>
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container
                        columnSpacing={2}
                        rowSpacing={2}
                        columns={12}
                        justifyContent="center"
                        sx={{ alignSelf: 'center', textAlign: 'center' }}
                    >
                        <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Button variant="contained" onClick={setLeftTeam.bind(null)}
                                sx={{
                                    width: 1, height: 64
                                }}>
                                <Typography variant="h6">
                                    Sides set!
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container
                        columnSpacing={2}
                        rowSpacing={2}
                        columns={12}
                        justifyContent="center"
                        sx={{ alignSelf: 'center', textAlign: 'center' }}
                    >
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Typography variant="h4"> If you don't want auto-swap enabled: </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'left' }}>
                            <Button variant="contained" onClick={setNoSideSwitch.bind(null)}
                                sx={{
                                    width: 1, height: 64
                                }}>
                                <Typography variant="h6">
                                    Don't swap!
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );

}

export default SetLeftStartTeam;



