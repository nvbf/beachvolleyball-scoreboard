import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { AdminMatch, MatchState } from "./types";
import { getInitials } from "../../util/names";
import { getMatchState } from "./adminMatchFunctions";
import { colors } from "../../theme";

const timeOnly = (ts: number): string =>
    new Date(ts).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

interface CourtStatusOverlayProps {
    matches: AdminMatch[];
    onClose: () => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type CourtStatus = "ongoing" | "ready" | "late" | "very-late" | "done";

interface CourtInfo {
    name: string;
    status: CourtStatus;
    delayMinutes: number;
    currentMatch: AdminMatch | null;
    nextMatch: AdminMatch | null;
    matchesLeft: number;
    lastFinishedAt: number | null;
}

// ─── Colors per status ────────────────────────────────────────────────────────

const statusConfig: Record<
    CourtStatus,
    { border: string; cardBg: string; headerBg: string; nameColor: string; badgeBg: string; textColor: string; timeColor: string; footerColor: string; badgeLabel: (delay: number) => string }
> = {
    ongoing: {
        border: "#378add", cardBg: "#eaf2fb", headerBg: "#d0e6f7",
        nameColor: "#0c447c", badgeBg: "#378add", textColor: "#185fa5",
        timeColor: "#378add", footerColor: "#185fa5",
        badgeLabel: () => "Ongoing",
    },
    ready: {
        border: "#639922", cardBg: "#eaf3de", headerBg: "#d4e8b4",
        nameColor: "#27500a", badgeBg: "#639922", textColor: "#3b6d11",
        timeColor: "#639922", footerColor: "#3b6d11",
        badgeLabel: () => "Ready",
    },
    late: {
        border: "#ba7517", cardBg: "#faeeda", headerBg: "#f5d89a",
        nameColor: "#412402", badgeBg: "#ba7517", textColor: "#633806",
        timeColor: "#ba7517", footerColor: "#633806",
        badgeLabel: (d) => `+${d} min`,
    },
    "very-late": {
        border: "#a32d2d", cardBg: "#fcebeb", headerBg: "#f5c0c0",
        nameColor: "#501313", badgeBg: "#a32d2d", textColor: "#791f1f",
        timeColor: "#a32d2d", footerColor: "#791f1f",
        badgeLabel: (d) => `+${d} min`,
    },
    done: {
        border: "#b0a590", cardBg: "#f0ebe0", headerBg: "#e5ddd0",
        nameColor: "#5a5040", badgeBg: "#b0a590", textColor: "#7a6f5e",
        timeColor: "#9a8e7e", footerColor: "#7a6f5e",
        badgeLabel: () => "Done",
    },
};

const todayStr = () => new Date().toISOString().split("T")[0];

const isToday = (m: AdminMatch) =>
    new Date(m.startTime).toISOString().split("T")[0] === todayStr();

const delayMinutes = (m: AdminMatch): number => {
    if (!m.startTimestamp || m.startTimestamp === 0) return 0;
    const diff = m.startTimestamp - m.startTime;
    return diff > 0 ? Math.round(diff / 60000) : 0;
};

const teamLine = (m: AdminMatch) =>
    `${getInitials(m.homeTeam.player1)} / ${getInitials(m.homeTeam.player2)}`;

const vsLine = (m: AdminMatch) =>
    `${getInitials(m.awayTeam.player1)} / ${getInitials(m.awayTeam.player2)}`;

// ─── Build court info from matches ───────────────────────────────────────────

const buildCourtInfo = (matches: AdminMatch[]): CourtInfo[] => {
    const todayMatches = matches.filter(isToday);

    const courtNames = Array.from(new Set(todayMatches.map(m => m.arenaName))).sort();

    return courtNames.map(name => {
        const courtMatches = todayMatches
            .filter(m => m.arenaName === name)
            .sort((a, b) => a.startTime - b.startTime);

        const ongoing = courtMatches.find(
            m => getMatchState(m) === MatchState.Ongoing
        ) ?? null;

        const finished = courtMatches.filter(
            m => getMatchState(m) === MatchState.Finished || getMatchState(m) === MatchState.Reported
        );

        const upcoming = courtMatches.filter(
            m => getMatchState(m) === MatchState.Upcoming
        );

        const allDone = courtMatches.every(
            m => getMatchState(m) === MatchState.Finished || getMatchState(m) === MatchState.Reported
        );

        const lastFinished = finished.length > 0
            ? finished[finished.length - 1]
            : null;

        const nextMatch = upcoming.length > 0 ? upcoming[0] : null;
        const matchesLeft = upcoming.length + (ongoing ? 1 : 0);

        // Determine status
        let status: CourtStatus;
        let delay = 0;

        if (allDone && courtMatches.length > 0) {
            status = "done";
        } else if (ongoing) {
            delay = delayMinutes(ongoing);
            if (delay >= 60) status = "very-late";
            else if (delay >= 30) status = "late";
            else status = "ongoing";
        } else if (nextMatch || lastFinished) {
            status = "ready";
        } else {
            status = "done";
        }

        return {
            name,
            status,
            delayMinutes: delay,
            currentMatch: ongoing,
            nextMatch,
            matchesLeft,
            lastFinishedAt: lastFinished?.startTimestamp ?? null,
        };
    });
};

// ─── Court card ───────────────────────────────────────────────────────────────

const CourtCard: React.FC<{ court: CourtInfo }> = ({ court }) => {
    const cfg = statusConfig[court.status];

    const timeLabel = () => {
        if (court.status === "done") {
            return court.lastFinishedAt
                ? `Finished ${timeOnly(court.lastFinishedAt)}`
                : "All done";
        }
        if (court.status === "ready") {
            return court.lastFinishedAt
                ? `Last done · ${timeOnly(court.lastFinishedAt)}`
                : "Ready";
        }
        if (court.currentMatch) {
            const delay = court.delayMinutes;
            const actual = timeOnly(court.currentMatch.startTimestamp || court.currentMatch.startTime);
            const sched = timeOnly(court.currentMatch.startTime);
            if (delay > 0) return `Started ${actual} · sched. ${sched}`;
            return `On time · ${actual}`;
        }
        return "";
    };

    return (
        <Box
            sx={{
                borderRadius: "6px",
                overflow: "hidden",
                border: `1px solid ${cfg.border}`,
                borderLeft: `3px solid ${cfg.border}`,
                backgroundColor: cfg.cardBg,
                opacity: court.status === "done" ? 0.7 : 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: "12px",
                    py: "8px",
                    backgroundColor: cfg.headerBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "6px",
                }}
            >
                <Typography
                    sx={{ fontSize: "13px", fontWeight: 600, color: cfg.nameColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                    {court.name}
                </Typography>
                <Box
                    sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        px: "7px",
                        py: "2px",
                        borderRadius: "8px",
                        backgroundColor: cfg.badgeBg,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    {cfg.badgeLabel(court.delayMinutes)}
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: "12px", py: "8px", flex: 1 }}>
                {court.status === "done" ? (
                    <>
                        <Typography sx={{ fontSize: "12px", color: cfg.textColor }}>All matches completed</Typography>
                        {court.currentMatch && (
                            <Typography sx={{ fontSize: "12px", color: cfg.textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                Last: {teamLine(court.currentMatch)}
                            </Typography>
                        )}
                    </>
                ) : court.status === "ready" && court.nextMatch ? (
                    <>
                        <Typography sx={{ fontSize: "12px", color: cfg.textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            Next: {teamLine(court.nextMatch)}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", color: cfg.textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {vsLine(court.nextMatch)}
                        </Typography>
                    </>
                ) : court.currentMatch ? (
                    <>
                        <Typography sx={{ fontSize: "12px", color: cfg.textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {teamLine(court.currentMatch)}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", color: cfg.textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {vsLine(court.currentMatch)}
                        </Typography>
                    </>
                ) : (
                    <Typography sx={{ fontSize: "12px", color: cfg.textColor }}>No active match</Typography>
                )}
                <Typography sx={{ fontSize: "11px", color: cfg.timeColor, mt: "4px" }}>
                    {timeLabel()}
                </Typography>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    px: "12px",
                    py: "5px",
                    borderTop: `1px solid rgba(0,0,0,0.06)`,
                    fontSize: "11px",
                    color: cfg.footerColor,
                }}
            >
                {court.matchesLeft === 0
                    ? "0 matches left"
                    : `${court.matchesLeft} match${court.matchesLeft !== 1 ? "es" : ""} left`}
            </Box>
        </Box>
    );
};

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND = [
    { color: "#378add", label: "Ongoing, on time" },
    { color: "#639922", label: "Ready for next" },
    { color: "#ba7517", label: "30–60 min late" },
    { color: "#a32d2d", label: "60+ min late" },
    { color: "#b0a590", label: "All done" },
];

// ─── Main overlay ─────────────────────────────────────────────────────────────

export const CourtStatusOverlay: React.FC<CourtStatusOverlayProps> = ({ matches, onClose }) => {
    const courts = useMemo(() => buildCourtInfo(matches), [matches]);

    return (
        <Box
            onClick={onClose}
            sx={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(30,28,25,0.72)",
                zIndex: 1300,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pt: { xs: "12px", sm: "24px" },
                px: "12px",
                overflowY: "auto",
            }}
        >
            <Box
                onClick={e => e.stopPropagation()}
                sx={{
                    backgroundColor: colors.pageBg,
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "900px",
                    overflow: "hidden",
                    mb: "24px",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        backgroundColor: colors.headerBg,
                        color: colors.headerText,
                        px: "20px",
                        py: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                        Court status overview
                    </Typography>
                    <Box
                        onClick={onClose}
                        sx={{
                            cursor: "pointer",
                            color: colors.headerMuted,
                            display: "flex",
                            alignItems: "center",
                            "&:hover": { color: colors.headerText },
                        }}
                    >
                        <Close sx={{ fontSize: "22px" }} />
                    </Box>
                </Box>

                {/* Grid */}
                <Box
                    sx={{
                        p: "14px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "10px",
                    }}
                >
                    {courts.map(court => (
                        <CourtCard key={court.name} court={court} />
                    ))}
                </Box>

                {/* Legend */}
                <Box
                    sx={{
                        px: "14px",
                        pb: "14px",
                        pt: "6px",
                        borderTop: `1px solid ${colors.borderLight}`,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px 18px",
                    }}
                >
                    {LEGEND.map(({ color, label }) => (
                        <Box key={label} sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: "12px", color: colors.textMuted }}>{label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default CourtStatusOverlay;