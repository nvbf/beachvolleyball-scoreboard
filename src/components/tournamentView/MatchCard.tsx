import React from "react";
import { Box, Typography } from "@mui/material";
import { Place, AccessTime } from "@mui/icons-material";
import { AdminMatch, MatchState } from "../tournamentAdmin/types";
import { TeamType } from "../types";
import { getInitials } from "../../util/names";
import { getMatchState } from "../tournamentAdmin/adminMatchFunctions";
import { timestampToString } from "../../util/time";
import { colors, statusColors, MatchStatus } from "../../theme";

interface MatchCardProps {
    match: AdminMatch;
    tournamentSlug: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getProfixioSets = (
    sets: { [key: string]: number }[],
    team: TeamType
): number =>
    sets.reduce((acc, s) => {
        const homeWon = s["PointsHomeTeam"] > s["PointsAwayTeam"];
        return acc + (team === TeamType.Home ? (homeWon ? 1 : 0) : homeWon ? 0 : 1);
    }, 0);

// ─── Status pill ─────────────────────────────────────────────────────────────

const StatusPill: React.FC<{ status: MatchStatus }> = ({ status }) => {
    const s = statusColors[status];
    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "9px",
                fontWeight: 600,
                px: "5px",
                py: "1px",
                borderRadius: "3px",
                backgroundColor: s.statusBg,
                color: s.statusText,
                whiteSpace: "nowrap",
                flexShrink: 0,
            }}
        >
            <Box
                sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: s.dot,
                    flexShrink: 0,
                }}
            />
            {s.label}
        </Box>
    );
};

// ─── Per-set score columns ────────────────────────────────────────────────────
// Renders N columns, each showing home score on top and away score on bottom,
// aligned so scores across both team rows line up vertically.

interface SetColumnsProps {
    sets: { home: number; away: number }[];
}

const SetColumns: React.FC<SetColumnsProps> = ({ sets }) => (
    <Box sx={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        {sets.map((set, i) => (
            <Box
                key={i}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    backgroundColor: colors.setBg,
                    borderRadius: "3px",
                    px: "4px",
                    py: "2px",
                    minWidth: "0",
                    width: "22px",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "10px",
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 500,
                        color: set.home > set.away ? colors.textPrimary : colors.textFaint,
                        lineHeight: 1,
                    }}
                >
                    {set.home}
                </Typography>
                <Box sx={{ height: "1px", width: "100%", backgroundColor: colors.borderMeta }} />
                <Typography
                    sx={{
                        fontSize: "10px",
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 500,
                        color: set.away > set.home ? colors.textPrimary : colors.textFaint,
                        lineHeight: 1,
                    }}
                >
                    {set.away}
                </Typography>
            </Box>
        ))}
    </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const matchState = getMatchState(match);
    const isFinished =
        matchState === MatchState.Finished || matchState === MatchState.Reported;
    const isOngoing = matchState === MatchState.Ongoing;
    const isUpcoming = !isFinished && !isOngoing;

    const status: MatchStatus = isFinished
        ? "finished"
        : isOngoing
            ? "ongoing"
            : "upcoming";

    const s = statusColors[status];

    const homeSetScore = match.hasWinner
        ? getProfixioSets(match.sets, TeamType.Home)
        : match.currentSetScore?.[TeamType.Home] ?? 0;

    const awaySetScore = match.hasWinner
        ? getProfixioSets(match.sets, TeamType.Away)
        : match.currentSetScore?.[TeamType.Away] ?? 0;

    const homeWinning = homeSetScore > awaySetScore;
    const awayWinning = awaySetScore > homeSetScore;
    const hasScore = match.hasWinner || !!match.currentScore;

    // Build unified set data for SetColumns
    const currentScoreArray = Array.isArray(match.currentScore)
        ? match.currentScore
        : [];

    const setSets: { home: number; away: number }[] = match.hasWinner
        ? match.sets.map((set) => ({
            home: set["PointsHomeTeam"],
            away: set["PointsAwayTeam"],
        }))
        : currentScoreArray.map((set) => ({
            home: set["HOME"],
            away: set["AWAY"],
        }));

    const homeTextColor = !hasScore
        ? colors.textMuted
        : homeWinning
            ? colors.textPrimary
            : colors.textFaint;

    const awayTextColor = !hasScore
        ? colors.textMuted
        : awayWinning
            ? colors.textPrimary
            : colors.textFaint;

    const homeScoreColor = !hasScore
        ? colors.textMuted
        : homeWinning
            ? colors.textPrimary
            : colors.finishedBorder;

    const awayScoreColor = !hasScore
        ? colors.textMuted
        : awayWinning
            ? colors.textPrimary
            : colors.finishedBorder;

    return (
        <Box
            sx={{
                backgroundColor: s.cardBg,
                borderRadius: "8px",
                border: `1px solid ${colors.borderLight}`,
                borderLeft: `3.5px solid ${s.borderLeft}`,
                overflow: "hidden",
                display: "flex",
                mb: "6px",
                opacity: isFinished ? 0.88 : 1,
            }}
        >
            {/* ── Meta panel — narrower to give body more room ── */}
            <Box
                sx={{
                    width: { xs: "88px", sm: "96px" },
                    minWidth: { xs: "88px", sm: "96px" },
                    px: "8px",
                    py: "5px",
                    borderRight: `1px solid ${colors.borderMeta}`,
                    backgroundColor: s.metaBg,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "3px",
                    flexShrink: 0,
                }}
            >
                {/* Match number + status pill */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Typography
                        sx={{ fontSize: "10px", fontWeight: 600, color: colors.textFaint, flexShrink: 0 }}
                    >
                        #{match.matchId}
                    </Typography>
                    <StatusPill status={status} />
                </Box>

                {/* Time */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "2px", color: colors.textMuted }}>
                    <AccessTime sx={{ fontSize: "10px", opacity: 0.5, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: "10px", lineHeight: 1.3 }}>
                        {timestampToString(match.startTime)}
                    </Typography>
                </Box>

                {/* Category badge */}
                <Box
                    sx={{
                        display: "inline-block",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        px: "5px",
                        py: "1px",
                        borderRadius: "3px",
                        backgroundColor: colors.badgeBg,
                        color: colors.badgeText,
                        border: `1px solid ${colors.badgeBorder}`,
                        width: "fit-content",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    }}
                >
                    {match.matchCategory}
                    {match.matchGroup ? ` – Group ${match.matchGroup}` : ""}
                </Box>

                {/* Court */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "2px", color: colors.textMuted }}>
                    <Place sx={{ fontSize: "10px", opacity: 0.5, flexShrink: 0 }} />
                    <Typography
                        sx={{
                            fontSize: "10px",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {match.arenaName}
                    </Typography>
                </Box>
            </Box>

            {/* ── Match body ── */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    px: "10px",
                    py: "5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "4px",
                }}
            >
                {/* Home row: name + set home scores + total */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: homeWinning ? 600 : 400,
                            color: homeTextColor,
                            flex: "1 1 0",
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getInitials(match.homeTeam.player1)} / {getInitials(match.homeTeam.player2)}
                    </Typography>
                    {/* Per-set home scores */}
                    {setSets.length > 0 && (
                        <Box sx={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                            {setSets.map((set, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: "12px",
                                        backgroundColor: colors.setBg,
                                        borderRadius: "3px 3px 0 0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        py: "2px",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "11px",
                                            fontFamily: "'DM Mono', monospace",
                                            fontWeight: 500,
                                            color: set.home > set.away ? colors.textPrimary : colors.textFaint,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {set.home}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {/* Total set score */}
                    {!isUpcoming && (
                        <Typography
                            sx={{
                                fontSize: "18px",
                                fontWeight: homeWinning ? 600 : 400,
                                fontFamily: "'DM Mono', monospace",
                                color: homeScoreColor,
                                lineHeight: 1,
                                flexShrink: 0,
                                width: "18px",
                                textAlign: "right",
                            }}
                        >
                            {homeSetScore}
                        </Typography>
                    )}
                </Box>

                {/* Divider — full width, no gaps */}
                <Box sx={{ height: "1px", backgroundColor: colors.borderMeta, mx: 0 }} />

                {/* Away row: name + set away scores + total */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: awayWinning ? 600 : 400,
                            color: awayTextColor,
                            flex: "1 1 0",
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getInitials(match.awayTeam.player1)} / {getInitials(match.awayTeam.player2)}
                    </Typography>
                    {/* Per-set away scores */}
                    {setSets.length > 0 && (
                        <Box sx={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                            {setSets.map((set, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: "12px",
                                        backgroundColor: colors.setBg,
                                        borderRadius: "0 0 3px 3px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        py: "2px",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "11px",
                                            fontFamily: "'DM Mono', monospace",
                                            fontWeight: 500,
                                            color: set.away > set.home ? colors.textPrimary : colors.textFaint,
                                            lineHeight: 1,
                                        }}
                                    >
                                        {set.away}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {/* Total set score */}
                    {!isUpcoming && (
                        <Typography
                            sx={{
                                fontSize: "18px",
                                fontWeight: awayWinning ? 600 : 400,
                                fontFamily: "'DM Mono', monospace",
                                color: awayScoreColor,
                                lineHeight: 1,
                                flexShrink: 0,
                                width: "18px",
                                textAlign: "right",
                            }}
                        >
                            {awaySetScore}
                        </Typography>
                    )}
                    {isUpcoming && (
                        <Typography sx={{ fontSize: "14px", color: colors.textFaint, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
                            –
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default MatchCard;