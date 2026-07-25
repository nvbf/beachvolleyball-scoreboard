import React from "react";
import { TeamType } from "../types";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addEvent, finalizeMatch } from "../../store/match/reducer";
import { finalizeMatchEvent } from "../eventFunctions";
import ScoreBox from "./scoreBox";
import { colors } from "../../theme";

export function MatchFinished() {
    const match = useAppSelector((state) => state.match);
    const dispatch = useAppDispatch();

    function handleDone() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: finalizeMatchEvent(match.authUserId) }));
        dispatch(finalizeMatch());
    }

    return (
        <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

            {/* Final set score — large */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                <ScoreBox score={match.currentSetScore[TeamType.Home]} color={match.teamColor[TeamType.Home]} size="large" />
                <ScoreBox score={match.currentSetScore[TeamType.Away]} color={match.teamColor[TeamType.Away]} size="large" />
            </Box>

            {/* Per-set scores — small */}
            {match.theCurrentSets.map((score, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
                    <ScoreBox score={score[TeamType.Home]} color={match.teamColor[TeamType.Home]} size="small" />
                    <ScoreBox score={score[TeamType.Away]} color={match.teamColor[TeamType.Away]} size="small" />
                </Box>
            ))}

            {/* Message */}
            <Box sx={{ textAlign: "center", mt: 3, mb: 4 }}>
                <Typography
                    sx={{
                        fontSize: { xs: "20px", sm: "24px" },
                        fontWeight: 500,
                        color: colors.textMuted,
                        mb: 1,
                    }}
                >
                    The match is done!
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: "20px", sm: "24px" },
                        fontWeight: 500,
                        color: colors.textMuted,
                        mb: 2,
                    }}
                >
                    Click on 'finalize' to finish.
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: "16px", sm: "18px" },
                        color: colors.textFaint,
                        lineHeight: 1.5,
                    }}
                >
                    (Undo will be disabled when the match is finalized)
                </Typography>
            </Box>

            {/* Finalize button */}
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
                        Finalize!
                    </Typography>
                </Button>
            </Box>

        </Box>
    );
}

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export default MatchFinished;