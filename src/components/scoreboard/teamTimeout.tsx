import React, { useState } from "react";
import { EventType, TeamType } from "../types";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent } from "../../store/match/reducer";
import TimeElapsed from "../timeElaped";
import { setClearMessageEvent } from "../eventFunctions";
import { colors, getTimeoutTimerColor } from "../../theme";

interface TeamTimeoutProps {
    team: TeamType;
}

export function TeamTimeout({ team }: TeamTimeoutProps) {
    const dispatch = useAppDispatch();
    const match = useAppSelector((state) => state.match);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setClearMessageEvent(match.authUserId) }));
    }

    const timeoutEvent = match.events.slice().reverse().find(e => e.eventType === EventType.Timeout && !e.undone);
    const timerColor = getTimeoutTimerColor(elapsedSeconds);

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
                The {team === TeamType.Home ? "home" : "away"} team called for a timeout
            </Typography>

            {/* Timer */}
            <Typography
                sx={{
                    fontSize: { xs: "48px", sm: "64px" },
                    fontWeight: 600,
                    color: timerColor,
                    textAlign: "center",
                    fontFamily: "'DM Mono', monospace",
                    lineHeight: 1,
                    mb: 4,
                }}
            >
                <TimeElapsed startTime={timeoutEvent?.timestamp || 0} onTick={setElapsedSeconds} />
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

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default TeamTimeout;