import React from "react";
import { Box, Typography } from "@mui/material";
import { Place, AccessTime } from "@mui/icons-material";
import { AdminMatch, MatchState } from "../tournamentAdmin/types";
import { TeamType } from "../types";
import { getInitials } from "../../util/names";
import { getMatchState } from "../tournamentAdmin/adminMatchFunctions";
import { dateStringToString, timestampToString } from "../../util/time";
import "./MatchCard.css";

interface MatchCardProps {
    match: AdminMatch;
    tournamentSlug: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, tournamentSlug }) => {
    const matchState = getMatchState(match);
    const isFinished = matchState === MatchState.Finished || matchState === MatchState.Reported;
    const isOngoing = matchState === MatchState.Ongoing;

    // Determine border color based on match state
    const getBorderColor = (): string => {
        if (isFinished) return "#A8E6CF"; // Green/Teal
        if (isOngoing) return "#FFD3B6"; // Orange
        return "#CBD5E0"; // Gray for upcoming
    };

    const getProfixioSets = (sets: { [key: string]: number }[], team: TeamType): number => {
        let score = 0;
        sets.forEach((e) => {
            if (team === TeamType.Home) {
                if (e["PointsHomeTeam"] > e["PointsAwayTeam"]) {
                    score++;
                }
            } else {
                if (e["PointsHomeTeam"] < e["PointsAwayTeam"]) {
                    score++;
                }
            }
        });
        return score;
    };

    const getTeamColor = (team: TeamType): string => {
        if (!match.hasWinner && !match.currentScore) return "#CBD5E0";

        if (match.hasWinner) {
            const homeWins = getProfixioSets(match.sets, TeamType.Home);
            const awayWins = getProfixioSets(match.sets, TeamType.Away);
            return team === TeamType.Home && homeWins > awayWins
                ? "#A8E6CF"
                : team === TeamType.Away && awayWins > homeWins
                    ? "#A8E6CF"
                    : "#CBD5E0";
        }

        if (match.currentScore) {
            const homeSetScore = match.currentSetScore[TeamType.Home] || 0;
            const awaySetScore = match.currentSetScore[TeamType.Away] || 0;
            return team === TeamType.Home && homeSetScore > awaySetScore
                ? "#A8E6CF"
                : team === TeamType.Away && awaySetScore > homeSetScore
                    ? "#A8E6CF"
                    : "#CBD5E0";
        }

        return "#CBD5E0";
    };

    const homeTeamColor = getTeamColor(TeamType.Home);
    const awayTeamColor = getTeamColor(TeamType.Away);



    const matchDate = new Date(match.startTime).toISOString().split("T")[0];

    return (
        <Box
            className={`match-card ${isFinished ? "opacity-85" : ""}`}
            sx={{
                backgroundColor: "#FAFAF8",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                borderLeft: `4px solid ${getBorderColor()}`,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                },
            }}
        >
            {/* Info Column */}
            <Box
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderBottom: { xs: "1px solid #E2E8F0", md: "none" },
                    borderRight: { xs: "none", md: "1px solid #E2E8F0" },
                    padding: { xs: "12px 16px", md: "20px" },
                    display: "flex",
                    flexDirection: { xs: "column", md: "column" },
                    justifyContent: "center",
                    alignItems: { xs: "flex-start", md: "flex-start" },
                    gap: { xs: 1, md: 2 },
                    minWidth: { md: "20%" },
                }}
            >
                {/* Row 1 (mobile): Match number + time */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        alignItems: { xs: "center", md: "flex-start" },
                        gap: { xs: 2, md: 1 },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "13px",
                            fontWeight: 1000,
                            backgroundColor: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            color: "#718096",
                        }}
                    >
                        #{match.matchId}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#718096",
                        }}
                    >
                        <AccessTime sx={{ fontSize: "18px" }} />
                        <span>{timestampToString(match.startTime)}</span>
                    </Box>
                </Box>

                {/* Row 2 (mobile): Category + court | desktop: stacked separately */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: { xs: "row", md: "column" },
                        alignItems: { xs: "center", md: "flex-start" },
                        gap: 1,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            backgroundColor: "#E5E7EB",
                            color: "#374151",
                            padding: "4px 8px",
                            borderRadius: "4px",
                        }}
                    >
                        {match.matchCategory}
                        {match.matchGroup ? ` - Group ${match.matchGroup}` : ""}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#718096",
                        }}
                    >
                        <Place sx={{ fontSize: "18px" }} />
                        <span>{match.arenaName}</span>
                    </Box>
                </Box>
            </Box>

            {/* Teams Column */}
            <Box
                sx={{
                    padding: { xs: "12px", md: "16px" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 3,
                    position: "relative",
                    flex: 1,
                    minWidth: { md: "55%" },
                }}
            >
                {/* Home Team */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: "2px",
                                height: "32px",
                                backgroundColor: homeTeamColor,
                                borderRadius: "1px",
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: { xs: "16px", md: "18px" },
                                fontWeight: 600,
                                color: homeTeamColor === "#CBD5E0" ? "#718096" : "#1A202C",
                            }}
                        >
                            {getInitials(match.homeTeam.player1)} / {getInitials(match.homeTeam.player2)}
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: { xs: "24px", md: "32px" },
                            fontWeight: 900,
                            color: homeTeamColor === "#CBD5E0" ? "#718096" : "#1A202C",
                        }}
                    >
                        {match.hasWinner ? getProfixioSets(match.sets, TeamType.Home) : match.currentSetScore?.[TeamType.Home] || 0}
                    </Typography>
                </Box>

                {/* VS Divider */}
                <Box
                    sx={{
                        height: "1px",
                        width: "100%",
                        backgroundColor: "#E2E8F0",
                        position: "relative",
                    }}
                >
                    <Typography
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#FAFAF8",
                            paddingX: 1,
                            fontSize: "12px",
                            color: "#718096",
                            fontWeight: 500,
                        }}
                    >
                        VS
                    </Typography>
                </Box>

                {/* Away Team */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: "2px",
                                height: "32px",
                                backgroundColor: awayTeamColor,
                                borderRadius: "1px",
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: { xs: "16px", md: "18px" },
                                fontWeight: awayTeamColor === "#CBD5E0" ? 500 : 600,
                                color: awayTeamColor === "#CBD5E0" ? "#718096" : "#1A202C",
                            }}
                        >
                            {getInitials(match.awayTeam.player1)} / {getInitials(match.awayTeam.player2)}
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: { xs: "24px", md: "32px" },
                            fontWeight: awayTeamColor === "#CBD5E0" ? 700 : 900,
                            color: awayTeamColor === "#CBD5E0" ? "#718096" : "#1A202C",
                        }}
                    >
                        {match.hasWinner ? getProfixioSets(match.sets, TeamType.Away) : match.currentSetScore?.[TeamType.Away] || 0}
                    </Typography>
                </Box>
            </Box>

            {/* Score/Court Column */}
            <Box
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderTop: { xs: "1px solid #E2E8F0", md: "none" },
                    borderLeft: { xs: "none", md: "1px solid #E2E8F0" },
                    padding: { xs: "16px", md: "20px" },
                    display: "flex",
                    flexDirection: { xs: "row", md: "column" },
                    justifyContent: { xs: "space-between", md: "flex-end" },
                    alignItems: { xs: "center", md: "flex-end" },
                    gap: 2,
                    minWidth: { md: "15%" },
                }}
            >
                <Box
                    sx={{
                        textAlign: "right",
                        marginTop: { md: "auto" },
                        paddingRight: { xs: "16px", md: "20px" },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#718096",
                            marginBottom: 0.5,
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        Set Scores
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, flexWrap: "wrap", gap: 0.5, alignItems: { xs: "flex-end", md: "flex-end" } }}>
                        {match.hasWinner
                            ? match.sets.map((s, i) => (
                                <Typography
                                    key={i}
                                    sx={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        fontFamily: "monospace",
                                        backgroundColor: "white",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                        color: "#2D3748",
                                    }}
                                >
                                    ({s.PointsHomeTeam}-{s.PointsAwayTeam})
                                </Typography>
                            ))
                            : (match.currentScore || []).map((s, i) => (
                                <Typography
                                    key={i}
                                    sx={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        fontFamily: "monospace",
                                        backgroundColor: "white",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                        color: "#2D3748",
                                    }}
                                >
                                    ({s.HOME}-{s.AWAY})
                                </Typography>
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MatchCard;
