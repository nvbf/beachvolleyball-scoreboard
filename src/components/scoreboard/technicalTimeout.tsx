import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent } from "../../store/match/reducer";
import { setClearMessageEvent } from "../eventFunctions";
import TimeElapsed from "../timeElaped";
import { colors } from "../../theme";

interface TechnicalTimeoutProps {
    startTime: number;
}

export function TechnicalTimeout({ startTime }: TechnicalTimeoutProps) {
    const dispatch = useAppDispatch();
    const match = useAppSelector((state) => state.match);

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setClearMessageEvent(match.authUserId) }));
    }

    return (
        <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

            {/* Label */}
            <Typography
                sx={{
                    fontSize: { xs: "18px", sm: "22px" },
                    fontWeight: 500,
                    color: colors.textMuted,
                    textAlign: "center",
                    mb: 3,
                    letterSpacing: "0.01em",
                }}
            >
                Technical timeout
            </Typography>

            {/* Timer */}
            <Typography
                sx={{
                    fontSize: { xs: "48px", sm: "64px" },
                    fontWeight: 600,
                    color: colors.textPrimary,
                    textAlign: "center",
                    fontFamily: "'DM Mono', monospace",
                    lineHeight: 1,
                    mb: 4,
                }}
            >
                <TimeElapsed startTime={startTime} />
            </Typography>

            {/* Done button */}
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

export default TechnicalTimeout;