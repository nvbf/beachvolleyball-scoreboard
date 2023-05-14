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
import { pickAwayColor, pickHomeColor } from "../../store/match/actions";


interface TeamColorPickerProps {
    team: TeamType;
}

export function TeamColorPicker({ team }: TeamColorPickerProps) {

    const dispatch = useAppDispatch();

    let colors: string[] = [
        "#ffffff", "#999999", "#000000",
        "#ff0000", "#ff5500", "#ffaa00",
        "#ffff00", "#aaff00", "#00ff55",
        "#00ffaa", "#00ffff", "#00aaff",
        "#0055ff", "#5500ff", "#aa00ff",
        "#ff00ff", "#ff00aa", "#ffaaaa"]

    function handleColorClick(color: string) {
        if (team === TeamType.Home) {
            dispatch(pickHomeColor(color));
        } else {
            dispatch(pickAwayColor(color));
        }
    }

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
                <Typography sx={{ fontSize: 28 }}>Choose a color for the {team === TeamType.Home ? "home" : "away"} team:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container
                    columnSpacing={1}
                    rowSpacing={1}
                    justifyContent="center"
                    columns={12}
                    sx={{ alignSelf: 'center', textAlign: 'center' }}
                >
                    {colors.map((color) => (
                        <Grid item sm={2} xs={4}>
                            <Button
                                sx={{
                                    width: 1, height: 42, backgroundColor: color,
                                    '&:hover': { backgroundColor: color }
                                }}
                                onClick={handleColorClick.bind(null, color)}
                            >

                                <Abc sx={{ fontSize: 42, color: getTextColorFromBackground(color) }} />
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
                        <Box>Go with default color</Box>
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