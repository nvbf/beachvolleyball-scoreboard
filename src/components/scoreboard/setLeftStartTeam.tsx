import { SwapHoriz } from '@mui/icons-material';
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from 'react';
import { addEvent } from '../../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType } from '../types';
import { getInitials } from "../../util/names";
import { setLeftStartTeamEvent, setNoSideSwitchEvent } from "../eventFunctions";
import { matchState } from "../../store/types";
import { getTextColorFromBackground } from "../../util/color";
import { colors } from "../../theme";

export function SetLeftStartTeam() {
    const match = useAppSelector((state) => state.match);
    const [leftSideTeam, setLeftSideTeam] = useState(TeamType.Home);
    const dispatch = useAppDispatch();

    function setLeftTeam() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setLeftStartTeamEvent(leftSideTeam, match.authUserId) }));
    }

    function setNoSideSwitch() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setNoSideSwitchEvent(match.authUserId) }));
    }

    function handleSwitch() {
        setLeftSideTeam(leftSideTeam === TeamType.Home ? TeamType.Away : TeamType.Home);
    }

    const getLeftTeam = (): TeamType => leftSideTeam;
    const getRightTeam = (): TeamType => leftSideTeam === TeamType.Home ? TeamType.Away : TeamType.Home;

    const getPlayer = (match: matchState, playerId: number, teamType: TeamType): string => {
        if (teamType === TeamType.Home) {
            return playerId === 1 ? match.homeTeam.player1Name : match.homeTeam.player2Name;
        } else {
            return playerId === 1 ? match.awayTeam.player1Name : match.awayTeam.player2Name;
        }
    };

    return (
        <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

            {/* ── Choose team sides ── */}
            <SectionLabel label="Choose team sides" />

            {/* Swap button */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleSwitch}
                    sx={{ width: { xs: "100%", sm: "60%" }, height: { xs: "56px", sm: "64px" }, borderRadius: "10px" }}
                >
                    <SwapHoriz sx={{ fontSize: 36 }} />
                </Button>
            </Box>

            {/* Team side buttons */}
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <TeamButton
                    label={[
                        getInitials(getPlayer(match, 1, getLeftTeam())),
                        getInitials(getPlayer(match, 2, getLeftTeam())),
                    ]}
                    color={match.teamColor[getLeftTeam()]}
                />
                <TeamButton
                    label={[
                        getInitials(getPlayer(match, 1, getRightTeam())),
                        getInitials(getPlayer(match, 2, getRightTeam())),
                    ]}
                    color={match.teamColor[getRightTeam()]}
                />
            </Box>

            {/* Sides set */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <Button
                    variant="contained"
                    onClick={setLeftTeam}
                    sx={{ width: { xs: "100%", sm: "60%" }, height: { xs: "56px", sm: "64px" }, borderRadius: "10px" }}
                >
                    <Typography sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: 600 }}>
                        Sides set!
                    </Typography>
                </Button>
            </Box>

            {/* No auto-swap */}
            <SectionLabel label="If you don't want auto-swap enabled:" />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    onClick={setNoSideSwitch}
                    sx={{ width: { xs: "100%", sm: "60%" }, height: { xs: "56px", sm: "64px" }, borderRadius: "10px" }}
                >
                    <Typography sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: 600 }}>
                        Don't swap!
                    </Typography>
                </Button>
            </Box>

        </Box>
    );
}

// ─── Section label ────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <Typography
        sx={{
            fontSize: { xs: "18px", sm: "22px" },
            fontWeight: 500,
            color: colors.textMuted,
            textAlign: "center",
            mb: 2,
            letterSpacing: "0.01em",
        }}
    >
        {label}
    </Typography>
);

// ─── Team button (color from user) ───────────────────────────────────────────

const TeamButton: React.FC<{ label: string[]; color: string }> = ({ label, color }) => {
    const textColor = getTextColorFromBackground(color);
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: { xs: "76px", sm: "92px" },
                backgroundColor: color,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                px: 2,
            }}
        >
            {label.map((line, i) => (
                <Typography
                    key={i}
                    sx={{
                        fontSize: { xs: "16px", sm: "20px" },
                        fontWeight: 700,
                        color: textColor,
                        letterSpacing: "0.04em",
                        lineHeight: 1.2,
                    }}
                >
                    {line}
                </Typography>
            ))}
        </Box>
    );
};

export default SetLeftStartTeam;