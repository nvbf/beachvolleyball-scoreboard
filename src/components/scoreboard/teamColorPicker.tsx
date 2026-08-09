import React from "react";
import { TeamType } from "../types";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getTextColorFromBackground } from "../../util/color";
import { addEvent, setTeamColor } from "../../store/match/reducer";
import { pickTeamColorEvent } from "../eventFunctions";
import { colors } from "../../theme";

interface TeamColorPickerProps {
    team: TeamType;
}

const colorList = [
    { color: "#333333", key: "Black" },
    { color: "#999999", key: "Gray" },
    { color: "#ffffff", key: "White" },
    { color: "#eeee00", key: "Yellow" },
    { color: "#ffaa00", key: "Amber" },
    { color: "#ff0000", key: "Red" },
    { color: "#bb22bb", key: "Pink" },
    { color: "#8800cc", key: "Purple" },
    { color: "#00aaff", key: "Blue" },
    { color: "#00eeee", key: "Cyan" },
    { color: "#00bb99", key: "Forest" },
    { color: "#00af00", key: "Green" },
];

function getDefaultColorByTeam(team: TeamType) {
    return team === TeamType.Home ? "#0000ff" : "#ff0000";
}

export function TeamColorPicker({ team }: TeamColorPickerProps) {
    const match = useAppSelector((state) => state.match);
    const dispatch = useAppDispatch();

    const taken = team === TeamType.Home ? match.teamColor[TeamType.Away] : match.teamColor[TeamType.Home];
    const selected = match.teamColor[team];

    function handleColorClick(color: string) {
        dispatch(setTeamColor({ color, team }));
    }

    const player1 = team === TeamType.Home ? match.homeTeam.player1Name : match.awayTeam.player1Name;
    const player2 = team === TeamType.Home ? match.homeTeam.player2Name : match.awayTeam.player2Name;

    return (
        <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

            {/* Header */}
            <Typography
                sx={{
                    fontSize: { xs: "18px", sm: "22px" },
                    fontWeight: 500,
                    color: colors.textMuted,
                    textAlign: "center",
                    mb: 1,
                    letterSpacing: "0.01em",
                }}
            >
                Choose a shirt color for the {team === TeamType.Home ? "home" : "away"} team:
            </Typography>
            <Typography
                sx={{
                    fontSize: { xs: "16px", sm: "20px" },
                    fontWeight: 600,
                    color: colors.textPrimary,
                    textAlign: "center",
                    lineHeight: 1.4,
                    mb: 3,
                }}
            >
                {player1}<br />{player2}
            </Typography>

            {/* Color grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)", md: "repeat(6, 1fr)" },
                    gap: "8px",
                    mb: 3,
                }}
            >
                {colorList.map((item) => {
                    const isTaken = taken === item.color;
                    const isSelected = selected === item.color;
                    return (
                        <Box
                            key={item.key}
                            onClick={isTaken ? undefined : () => handleColorClick(item.color)}
                            sx={{
                                height: { xs: "60px", sm: "72px" },
                                backgroundColor: isTaken ? "#cccccc" : item.color,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: isTaken ? "not-allowed" : "pointer",
                                opacity: isTaken ? 0.5 : 1,
                                border: isSelected ? "3px solid #2c2925" : "3px solid transparent",
                                boxShadow: isSelected ? "0 0 0 2px #2c2925" : "0 2px 6px rgba(0,0,0,0.15)",
                                transition: "filter 0.12s, border 0.12s",
                                "&:hover": isTaken ? {} : { filter: "brightness(1.1)" },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: "16px", sm: "18px" },
                                    fontWeight: 600,
                                    color: isTaken ? "#888" : getTextColorFromBackground(item.color),
                                    letterSpacing: "0.03em",
                                    userSelect: "none",
                                }}
                            >
                                {item.key}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Default color button */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                    onClick={() => handleColorClick(getDefaultColorByTeam(team))}
                    sx={{
                        width: { xs: "100%", sm: "60%" },
                        height: { xs: "56px", sm: "64px" },
                        backgroundColor: getDefaultColorByTeam(team),
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        transition: "filter 0.12s",
                        "&:hover": { filter: "brightness(1.1)" },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: "15px", sm: "18px" },
                            fontWeight: 600,
                            color: getTextColorFromBackground(getDefaultColorByTeam(team)),
                        }}
                    >
                        Go with default color
                    </Typography>
                </Box>
            </Box>

        </Box>
    );
}

export default TeamColorPicker;