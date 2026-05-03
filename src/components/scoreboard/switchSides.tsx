import React from "react";
import { TeamType } from "../types";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent } from "../../store/match/reducer";
import { setClearMessageEvent } from "../eventFunctions";
import { colors } from "../../theme";

export function SwitchSides() {
    const dispatch = useAppDispatch();
    const match = useAppSelector((state) => state.match);

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setClearMessageEvent(match.authUserId) }));
    }

    return (
        <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

            <Typography
                sx={{
                    fontSize: { xs: "18px", sm: "22px" },
                    fontWeight: 500,
                    color: colors.textMuted,
                    textAlign: "center",
                    mb: 4,
                    letterSpacing: "0.01em",
                }}
            >
                Switch sides!
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    onClick={handleDone}
                    sx={{
                        width: { xs: "100%", sm: "60%" },
                        height: { xs: "56px", sm: "64px" },
                        borderRadius: "10px",
                    }}
                >
                    <Typography sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: 600 }}>
                        Done!
                    </Typography>
                </Button>
            </Box>

        </Box>
    );
}

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default SwitchSides;