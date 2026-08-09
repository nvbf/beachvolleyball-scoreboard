import { Box, Button, Typography } from "@mui/material";
import React from 'react';
import { addEvent } from '../../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType } from '../types';
import { getInitials, withJerseyNumber, jerseyNumberFor } from "../../util/names";
import { setJerseyNumberEvent, confirmPlayerNumbersEvent } from "../eventFunctions";
import { matchState } from "../../store/types";
import { getTextColorFromBackground } from "../../util/color";
import { colors } from "../../theme";

export function SetPlayerNumbers() {
    const match = useAppSelector((state) => state.match);
    const dispatch = useAppDispatch();

    function pickJerseyOne(team: TeamType, player: number) {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: setJerseyNumberEvent(team, player, match.authUserId) }));
    }

    function handleContinue() {
        dispatch(addEvent({ matchId: match.matchId, id: match.id, event: confirmPlayerNumbersEvent(match.authUserId) }));
    }

    return (
        <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

            <TeamNumberSection label="Home team — who wears #1?" team={TeamType.Home} match={match} onPick={pickJerseyOne} />
            <TeamNumberSection label="Away team — who wears #1?" team={TeamType.Away} match={match} onPick={pickJerseyOne} />

            {/* Continue */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    onClick={handleContinue}
                    sx={{ width: { xs: "100%", sm: "60%" }, height: { xs: "56px", sm: "64px" }, borderRadius: "10px" }}
                >
                    <Typography sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: 600 }}>
                        Continue
                    </Typography>
                </Button>
            </Box>
            <Typography
                sx={{
                    fontSize: { xs: "13px", sm: "14px" },
                    color: colors.textMuted,
                    textAlign: "center",
                    mt: 1.5,
                }}
            >
                No jersey number? Just tap Continue.
            </Typography>

        </Box>
    );
}

// ─── Team number section ───────────────────────────────────────────────────

interface TeamNumberSectionProps {
    label: string;
    team: TeamType;
    match: matchState;
    onPick: (team: TeamType, player: number) => void;
}

const TeamNumberSection: React.FC<TeamNumberSectionProps> = ({ label, team, match, onPick }) => {
    const color = match.teamColor[team];
    const player1Name = team === TeamType.Home ? match.homeTeam.player1Name : match.awayTeam.player1Name;
    const player2Name = team === TeamType.Home ? match.homeTeam.player2Name : match.awayTeam.player2Name;
    const jerseyNumberOne = match.jerseyNumberOne[team];

    return (
        <Box sx={{ mb: 4 }}>
            <SectionLabel label={label} />
            <Box sx={{ display: "flex", gap: 2 }}>
                <PlayerButton
                    label={withJerseyNumber(getInitials(player1Name), jerseyNumberFor(jerseyNumberOne, 1))}
                    color={color}
                    selected={jerseyNumberOne === 1}
                    onClick={() => onPick(team, 1)}
                />
                <PlayerButton
                    label={withJerseyNumber(getInitials(player2Name), jerseyNumberFor(jerseyNumberOne, 2))}
                    color={color}
                    selected={jerseyNumberOne === 2}
                    onClick={() => onPick(team, 2)}
                />
            </Box>
        </Box>
    );
};

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

// ─── Player button ────────────────────────────────────────────────────────────

interface PlayerButtonProps {
    label: string;
    color: string;
    selected: boolean;
    onClick: () => void;
}

const PlayerButton: React.FC<PlayerButtonProps> = ({ label, color, selected, onClick }) => {
    const textColor = getTextColorFromBackground(color);

    return (
        <Box
            onClick={onClick}
            sx={{
                flex: 1,
                minHeight: { xs: "76px", sm: "88px" },
                backgroundColor: color,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: selected ? "3px solid #2c2925" : "3px solid transparent",
                boxShadow: selected ? "0 0 0 2px #2c2925" : "0 2px 8px rgba(0,0,0,0.15)",
                transition: "filter 0.12s, border 0.12s",
                "&:hover": { filter: "brightness(1.08)" },
                px: 2,
            }}
        >
            <Typography
                sx={{
                    fontSize: { xs: "16px", sm: "20px" },
                    fontWeight: 700,
                    color: textColor,
                    letterSpacing: "0.04em",
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default SetPlayerNumbers;
