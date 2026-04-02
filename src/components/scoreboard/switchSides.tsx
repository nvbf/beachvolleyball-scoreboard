import React, { useState } from "react";
import { TeamType } from "../types";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getTextColorFromBackground } from "../../util/color";
import { addEvent } from "../../store/match/reducer";
import { setClearMessageEvent } from "../eventFunctions";


interface TeamColorPickerProps {
    team: TeamType;
}

export function SwitchSides() {

    const dispatch = useAppDispatch();
    const match = useAppSelector((state) => state.match);

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setClearMessageEvent(match.authUserId) }))
    }

    return (
        <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            justifyContent="center"
            columns={12}
            sx={{ alignSelf: 'center', textAlign: 'center' }}
            marginTop={4}
        >
            <Grid size={12}>
                <Typography sx={{ fontSize: 28 }}>Switch sides!!</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'left' }}>
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

export default SwitchSides;