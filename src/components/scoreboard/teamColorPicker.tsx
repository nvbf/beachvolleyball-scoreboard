import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ChromePicker } from "react-color";
import {
    Abc,
} from '@mui/icons-material';
import { getTextColorFromBackground } from "../../util/color";
import { addEvent, setTeamColor } from "../../store/match/reducer";
import { pickTeamColorEvent } from "../eventFunctions";


interface TeamColorPickerProps {
    team: TeamType;
}

export function TeamColorPicker({ team }: TeamColorPickerProps) {
    const match = useAppSelector((state) => state.match);
    const dispatch = useAppDispatch();

    const colorList = [
        { color: "#333333", key: "black" },
        { color: "#999999", key: "gray" },
        { color: "#ffffff", key: "white" },
        { color: "#eeee00", key: "yellow" },
        // { color: "#aaff00", key: "lime" },
        { color: "#ffaa00", key: "amber" },
        { color: "#ff0000", key: "red" },
        { color: "#bb22bb", key: "pink" },
        { color: "#8800cc", key: "purple" },
        { color: "#00aaff", key: "blue" },
        { color: "#00eeee", key: "cyan" },
        { color: "#00bb99", key: "forest" },
        { color: "#00af00", key: "green" },
        // { color: "#0055ff", key: "blue" },
        // { color: "#5500ff", key: "indigo" },
        // { color: "#ff00aa", key: "magenta" },
        // { color: "#ffaaaa", key: "light-pink" },
        // { color: "#ff5500", key: "orange" },
    ];

    function handleColorClick(color: string) {
        dispatch(setTeamColor({ color: color, team: team }));
    }

    let taken = team === TeamType.Home ? match.teamColor[TeamType.Away] : match.teamColor[TeamType.Home]
    console.log(taken)

    return (
        <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            justifyContent="center"
            columns={12}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
        >
            <Grid item xs={12}>
                <Typography sx={{ fontSize: 28 }}>Choose a shirt color for the {team === TeamType.Home ? "home" : "away"} team:</Typography>
                <Typography sx={{ fontSize: 28 }}>{team === TeamType.Home ? match.homeTeam.player1Name : match.awayTeam.player1Name}</Typography>
                <Typography sx={{ fontSize: 28 }}>{team === TeamType.Home ? match.homeTeam.player2Name : match.awayTeam.player2Name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container
                    columnSpacing={1}
                    rowSpacing={1}
                    justifyContent="center"
                    columns={12}
                    sx={{ alignSelf: 'center', textAlign: 'center' }}
                >
                    {colorList.map((item) => (
                        <Grid item sm={2} xs={4} key={item.key}
                        >
                            <Button
                                disabled={taken === item.color}

                                sx={{
                                    width: 1, height: 64,
                                    backgroundColor: taken === item.color ? "#cccccc" : item.color,
                                    '&:hover': { backgroundColor: item.color }
                                }}
                                onClick={handleColorClick.bind(null, item.color)}
                            >
                                <Typography sx={{ fontSize: 22, color: getTextColorFromBackground(item.color) }}>
                                    {item.key}
                                </Typography>
                                {/* <Abc sx={{ fontSize: 42, color: getTextColorFromBackground(item.color) }} /> */}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item md={6} xs={12} sx={{ textAlign: 'left' }}>
                <Button variant="contained" onClick={handleColorClick.bind(null, getDefaultColorByTeam(team))}
                    sx={{
                        width: 1, height: 64, backgroundColor: getDefaultColorByTeam(team),
                        '&:hover': { backgroundColor: getDefaultColorByTeam(team) }
                    }}>
                    <Typography sx={{ fontSize: 22, color: getTextColorFromBackground(getDefaultColorByTeam(team)) }}>
                        Go with default color
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default TeamColorPicker;