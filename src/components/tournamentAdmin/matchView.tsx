import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tooltip } from "@mui/material";
import {
    Place,
    AccessTime,
    Sync,
    CloudSync,
    SyncProblem,
    QrCodeScanner,
    QrCode,
    GavelRounded,
} from "@mui/icons-material";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { AdminMatch, MatchState } from "./types";
import { TeamType } from "../types";
import { getInitials } from "../../util/names";
import { getMatchState } from "./adminMatchFunctions";
import { timestampToString } from "../../util/time";
import { colors, statusColors, MatchStatus } from "../../theme";
import { fetchMatchesRequest } from "../../store/tournamentAdmin/reducer";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";

interface MatchViewProps {
    match: AdminMatch;
    tournamentSlug: string;
    secret: string;
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

const StatusPill: React.FC<{ status: MatchStatus; label?: string }> = ({ status, label }) => {
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
            {label ?? s.label}
        </Box>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

export function MatchView({ match, tournamentSlug, secret }: MatchViewProps) {
    const [open, setOpen] = useState(false);
    const [activeQrCode, setActiveQrCode] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateFailed, setUpdateFailed] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [finalizeRetryAt, setFinalizeRetryAt] = useState<Date | null>(null);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const dispatch = useDispatch();

    const handleClose = () => setOpen(false);

    // Auto-clear the retry block when the server's retry time has passed
    useEffect(() => {
        if (!finalizeRetryAt) return;
        const msLeft = finalizeRetryAt.getTime() - Date.now();
        if (msLeft <= 0) {
            setFinalizeRetryAt(null);
            return;
        }
        const timer = setTimeout(() => setFinalizeRetryAt(null), msLeft);
        return () => clearTimeout(timer);
    }, [finalizeRetryAt]);

    const handleFinalize = async () => {
        if (finalizeRetryAt && new Date() < finalizeRetryAt) {
            const secsLeft = Math.ceil((finalizeRetryAt.getTime() - Date.now()) / 1000);
            setPopupMessage(`Please wait ${secsLeft}s before retrying.`);
            return;
        }

        setIsFinalizing(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                setPopupMessage("You must be authenticated to finalize a match.");
                return;
            }

            const idToken = await user.getIdToken();
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/match/v1/result/finalize/${match.scoreboardID}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                dispatch(fetchMatchesRequest({ tournamentSlug, class: null }));
                setFinalizeRetryAt(null);
            } else if (response.status === 400) {
                const retryAtHeader = response.headers.get("x-retry-at");
                const retryAfterHeader = response.headers.get("retry-after");
                console.log("400 response headers:", { retryAtHeader, retryAfterHeader });
                console.log("All headers:", [...response.headers.entries()]);
                if (retryAtHeader) {
                    const retryDate = new Date(retryAtHeader);
                    setFinalizeRetryAt(retryDate);
                    const secsLeft = retryAfterHeader
                        ? parseInt(retryAfterHeader, 10)
                        : Math.ceil((retryDate.getTime() - Date.now()) / 1000);
                    setPopupMessage(`Cannot finalize yet. Retry in ${secsLeft}s (at ${retryDate.toLocaleTimeString()}).`);
                } else {
                    const body = await response.json().catch(() => null);
                    setPopupMessage(body?.error ?? "Cannot finalize yet.");
                }
            }
        } catch (e) {
            setPopupMessage("Failed to reach the server. Please try again.");
        }
        setIsFinalizing(false);
    };

    const handleSync = async () => {
        setIsUpdating(true);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/sync/v1/tournament/${tournamentSlug}/match/${match.matchId}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        if (response.ok) {
            dispatch(fetchMatchesRequest({ tournamentSlug, class: null }));
            setUpdateFailed(false);
        } else {
            setUpdateFailed(true);
        }
        setIsUpdating(false);
    };

    const url = match.scoreboardID
        ? `https://${window.location.hostname}/match/${match.scoreboardID}`
        : `https://${window.location.hostname}/match?name1=${encodeURIComponent(match.homeTeam.player1)}&name2=${encodeURIComponent(match.homeTeam.player2)}&name3=${encodeURIComponent(match.awayTeam.player1)}&name4=${encodeURIComponent(match.awayTeam.player2)}&matchId=${match.matchId}&tournamentId=${tournamentSlug}&secret=${secret}`;

    const handleOpen = (u: string) => {
        setActiveQrCode(u);
        setOpen(true);
    };

    const matchState = getMatchState(match);
    const isFinished = matchState === MatchState.Finished;
    const isReported = matchState === MatchState.Reported;
    const isOngoing = matchState === MatchState.Ongoing;
    const isUpcoming = matchState === MatchState.Upcoming;

    const status: MatchStatus = isReported
        ? "reported"
        : isFinished
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

    // Upcoming matches more than 10 min past scheduled start are "late"
    const upcomingDelayMin = Math.round((Date.now() - match.startTime) / 60000);
    const isLate = isUpcoming && upcomingDelayMin > 10;
    const lateLabel = isLate
        ? `Late (+${Math.floor(upcomingDelayMin / 60)}:${String(upcomingDelayMin % 60).padStart(2, "0")})`
        : undefined;

    return (
        <>
            <Box
                sx={{
                    backgroundColor: s.cardBg,
                    borderRadius: "8px",
                    border: `1px solid ${colors.borderLight}`,
                    borderLeft: `3.5px solid ${s.borderLeft}`,
                    overflow: "hidden",
                    display: "flex",
                    mb: "6px",
                    opacity: isFinished || isReported ? 0.88 : 1,
                }}
            >
                {/* ── Meta panel ── */}
                <Box
                    sx={{
                        width: { xs: "96px", sm: "150px" },
                        minWidth: { xs: "96px", sm: "150px" },
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
                    {/* ── Mobile: 4 lines ── */}

                    {/* Line 1 mobile: #id + status pill */}
                    <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: "4px" }}>
                        <Typography
                            sx={{ fontSize: "10px", fontWeight: 600, color: colors.textFaint, flexShrink: 0 }}
                        >
                            #{match.matchId}
                        </Typography>
                        <StatusPill status={status} label={lateLabel} />
                    </Box>

                    {/* Line 2 mobile: time */}
                    <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: "2px", color: colors.textMuted }}>
                        <AccessTime sx={{ fontSize: "10px", opacity: 0.5, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: "10px", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                            {timestampToString(match.startTime)}
                        </Typography>
                    </Box>

                    {/* Line 3 mobile: category badge */}
                    <Box
                        sx={{
                            display: { xs: "inline-block", sm: "none" },
                            fontSize: "9px",
                            fontWeight: 600,
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
                        {match.matchGroup ? ` – Group ${match.matchGroup}` : match.name ? ` – ${match.name}` : ""}
                    </Box>

                    {/* Line 4 mobile: court */}
                    <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: "2px", color: colors.textMuted }}>
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

                    {/* ── Desktop: 2 lines ── */}

                    {/* Line 1 desktop: #id · time */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: "4px", minWidth: 0 }}>
                        <Typography
                            sx={{ fontSize: "10px", fontWeight: 600, color: colors.textFaint, flexShrink: 0 }}
                        >
                            #{match.matchId}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "2px", minWidth: 0, overflow: "hidden" }}>
                            <AccessTime sx={{ fontSize: "10px", opacity: 0.5, flexShrink: 0 }} />
                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: colors.textMuted,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    lineHeight: 1.3,
                                }}
                            >
                                {timestampToString(match.startTime)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Line 2 desktop: court · category badge */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: "4px", minWidth: 0, overflow: "hidden" }}>
                        <Place sx={{ fontSize: "10px", opacity: 0.5, flexShrink: 0 }} />
                        <Typography
                            sx={{
                                fontSize: "10px",
                                color: colors.textMuted,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.3,
                                flex: "1 1 0",
                                minWidth: 0,
                            }}
                        >
                            {match.arenaName}
                        </Typography>
                        <Typography sx={{ fontSize: "10px", color: colors.borderLight, flexShrink: 0 }}>·</Typography>
                        <Box
                            sx={{
                                fontSize: "9px",
                                fontWeight: 600,
                                px: "5px",
                                py: "1px",
                                borderRadius: "3px",
                                backgroundColor: colors.badgeBg,
                                color: colors.badgeText,
                                border: `1px solid ${colors.badgeBorder}`,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {match.matchCategory}
                            {match.matchGroup ? ` – ${match.matchGroup}` : match.name ? ` – ${match.name}` : ""}
                        </Box>
                    </Box>
                </Box>

                {/* ── Match body — wide layout (>900px): single line ── */}
                <Box
                    sx={{
                        display: { xs: "none", lg: "flex" },
                        flex: 1,
                        minWidth: 0,
                        px: "12px",
                        py: "5px",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    {/* Home team */}
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: homeWinning ? 600 : 400,
                            color: homeTextColor,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexShrink: 1,
                            minWidth: 0,
                        }}
                    >
                        {getInitials(match.homeTeam.player1)} / {getInitials(match.homeTeam.player2)}
                    </Typography>

                    {/* Separator */}
                    {!isUpcoming && (
                        <Typography sx={{ fontSize: "14px", color: colors.textFaint, flexShrink: 0 }}>–</Typography>
                    )}
                    {isUpcoming && (
                        <Typography sx={{ fontSize: "14px", color: colors.textFaint, flexShrink: 0 }}>vs</Typography>
                    )}

                    {/* Away team */}
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: awayWinning ? 600 : 400,
                            color: awayTextColor,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexShrink: 1,
                            minWidth: 0,
                        }}
                    >
                        {getInitials(match.awayTeam.player1)} / {getInitials(match.awayTeam.player2)}
                    </Typography>

                    {/* Spacer */}
                    <Box sx={{ flex: 1 }} />

                    {/* Referee — upcoming only, floats right */}
                    {isUpcoming && match.referee && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#9a8e7e" strokeWidth="1.4">
                                <circle cx="5" cy="10" r="3" />
                                <path d="M8 10h5l1-4H8" />
                                <path d="M10 6V4" />
                            </svg>
                            <Typography sx={{ fontSize: "13px", color: colors.textFaint, whiteSpace: "nowrap" }}>
                                {match.referee}
                            </Typography>
                        </Box>
                    )}

                    {/* Per-set scores: (21 – 13) (21 – 19) · total */}
                    {!isUpcoming && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                            {setSets.map((set, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "2px",
                                        backgroundColor: colors.setBg,
                                        borderRadius: "3px",
                                        px: "5px",
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
                                    <Typography sx={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: colors.textFaint, lineHeight: 1 }}>–</Typography>
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
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: homeWinning ? 600 : 400,
                                    fontFamily: "'DM Mono', monospace",
                                    color: homeScoreColor,
                                    lineHeight: 1,
                                }}
                            >
                                {homeSetScore}
                            </Typography>
                            <Typography sx={{ fontSize: "12px", color: colors.textFaint, fontFamily: "'DM Mono', monospace" }}>-</Typography>
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: awayWinning ? 600 : 400,
                                    fontFamily: "'DM Mono', monospace",
                                    color: awayScoreColor,
                                    lineHeight: 1,
                                }}
                            >
                                {awaySetScore}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ── Match body — narrow layout (<900px): stacked rows ── */}
                <Box
                    sx={{
                        display: { xs: "flex", lg: "none" },
                        flex: 1,
                        minWidth: 0,
                        px: "10px",
                        py: "5px",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "4px",
                    }}
                >
                    {/* Home row */}
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
                        {!isUpcoming && (
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: homeWinning ? 600 : 400,
                                    fontFamily: "'DM Mono', monospace",
                                    color: homeScoreColor,
                                    lineHeight: 1,
                                    flexShrink: 0,
                                    width: "16px",
                                    textAlign: "right",
                                }}
                            >
                                {homeSetScore}
                            </Typography>
                        )}
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: "1px", backgroundColor: colors.borderMeta }} />

                    {/* Away row */}
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
                        {!isUpcoming && (
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: awayWinning ? 600 : 400,
                                    fontFamily: "'DM Mono', monospace",
                                    color: awayScoreColor,
                                    lineHeight: 1,
                                    flexShrink: 0,
                                    width: "16px",
                                    textAlign: "right",
                                }}
                            >
                                {awaySetScore}
                            </Typography>
                        )}
                    </Box>

                    {/* Referee row — upcoming only, below second divider */}
                    {isUpcoming && match.referee && (
                        <>
                            <Box sx={{ height: "1px", backgroundColor: colors.borderMeta }} />
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
                                <Box
                                    component="span"
                                    sx={{ fontSize: "10px", display: "flex", alignItems: "center", flexShrink: 0 }}
                                >
                                    {/* Whistle icon */}
                                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#9a8e7e" strokeWidth="1.4">
                                        <circle cx="5" cy="10" r="3" />
                                        <path d="M8 10h5l1-4H8" />
                                        <path d="M10 6V4" />
                                    </svg>
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: colors.textFaint,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        flex: "1 1 0",
                                        minWidth: 0,
                                    }}
                                >
                                    {match.referee}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                {/* ── Action buttons ── */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "stretch",
                        borderLeft: `1px solid ${colors.borderMeta}`,
                        backgroundColor: s.metaBg,
                        flexShrink: 0,
                    }}
                >
                    {/* Sync button */}
                    <IconButton
                        onClick={handleSync}
                        size="small"
                        sx={{
                            color: updateFailed ? colors.upcomingBorder : colors.textMuted,
                            borderRadius: 0,
                            px: "10px",
                            py: 0,
                            height: "100%",
                            "&:hover": { backgroundColor: colors.borderLight },
                        }}
                        title="Sync match"
                    >
                        {isUpdating ? (
                            <CloudSync sx={{ fontSize: "18px" }} />
                        ) : updateFailed ? (
                            <SyncProblem sx={{ fontSize: "18px" }} />
                        ) : (
                            <Sync sx={{ fontSize: "18px" }} />
                        )}
                    </IconButton>

                    {/* Divider between buttons */}
                    <Box sx={{ width: "1px", backgroundColor: colors.borderMeta, flexShrink: 0 }} />

                    {/* QR button */}
                    <IconButton
                        onClick={() => handleOpen(url)}
                        size="small"
                        sx={{
                            color: match.scoreboardID ? colors.ongoingBorder : colors.textMuted,
                            borderRadius: 0,
                            px: "10px",
                            py: 0,
                            height: "100%",
                            "&:hover": { backgroundColor: colors.borderLight },
                        }}
                        title="Show QR code"
                    >
                        {match.scoreboardID ? (
                            <QrCode sx={{ fontSize: "18px" }} />
                        ) : (
                            <QrCodeScanner sx={{ fontSize: "18px" }} />
                        )}
                    </IconButton>

                    {/* Force finalize button — only when a team has 2 sets, match has a scoreboardID, is not yet reported, and not in retry cooldown */}
                    {match.scoreboardID && (match.currentSetScore?.["HOME"] >= 2 || match.currentSetScore?.["AWAY"] >= 2) && !isReported && !finalizeRetryAt && (
                        <>
                            <Box sx={{ width: "1px", backgroundColor: colors.borderMeta, flexShrink: 0 }} />
                            <Tooltip
                                title="Force finalize match"
                            >
                                <span>
                                    <IconButton
                                        onClick={handleFinalize}
                                        size="small"
                                        disabled={isFinalizing}
                                        sx={{
                                            color: colors.reportedDot,
                                            borderRadius: 0,
                                            px: "10px",
                                            py: 0,
                                            height: "100%",
                                            "&:hover": { backgroundColor: colors.borderLight },
                                            "&.Mui-disabled": { opacity: 0.4 },
                                        }}
                                    >
                                        <GavelRounded sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </>
                    )}
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <Box p={3}>
                    <QRCode value={activeQrCode} size={Math.min(512, window.outerWidth - 100)} />
                </Box>
            </Dialog>

            {/* Finalize error popup */}
            <Dialog
                open={popupMessage !== null}
                onClose={() => setPopupMessage(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderLight}`,
                        borderRadius: "10px",
                        px: 1,
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: "15px", fontWeight: 600, color: colors.textPrimary, pb: 1 }}>
                    Cannot finalize
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: "13px", color: colors.textMuted }}>
                        {popupMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPopupMessage(null)} variant="contained" size="small" sx={{ borderRadius: "8px" }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MatchView;