import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { clearNotification } from "../../store/match/actions";


interface TeamColorPickerProps {
    team: TeamType;
}

export function SetFinished() {

    const dispatch = useAppDispatch();

    function handleDone() {
        dispatch(clearNotification());
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
                <Typography sx={{ fontSize: 28 }}>Set done!!</Typography>
            </Grid>
            <Grid item md={6} xs={12} sx={{ textAlign: 'left' }}>
                <Button variant="contained" onClick={handleDone.bind(null)}
                    sx={{
                        width: 1, height: 64
                    }}>
                    <Typography>
                        Done!
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default SetFinished;