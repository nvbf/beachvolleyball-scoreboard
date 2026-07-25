import { createTheme } from "@mui/material/styles";

// ─── Color tokens ────────────────────────────────────────────────────────────
export const colors = {
    // Background
    pageBg: "#f0ebe0",       // sandy page background
    cardBg: "#faf7f2",       // card surface
    metaBg: "#f5f0e6",       // card meta panel
    metaBgOngoing: "#eef7f2",

    // Borders
    borderLight: "#ddd5c4",
    borderMeta: "#e5ddd0",

    // Text
    textPrimary: "#2c2925",
    textMuted: "#7a6f5e",
    textFaint: "#9a8e7e",

    // Header
    headerBg: "#1e1c19",
    headerText: "#f0ebe0",
    headerMuted: "#a09880",

    // Status — ongoing (green)
    ongoingBorder: "#3a9e6a",
    ongoingPillBg: "#edf7f1",
    ongoingPillText: "#1a5a38",
    ongoingPillBorder: "#3a9e6a",
    ongoingStatusBg: "#d6f0e4",
    ongoingStatusText: "#1e6b42",
    ongoingDot: "#3a9e6a",
    ongoingMetaBg: "#eef7f2",
    ongoingCardBg: "#f7fbf8",

    // Status — upcoming (red-orange)
    upcomingBorder: "#c8601a",
    upcomingPillBg: "#fdf0e8",
    upcomingPillText: "#7a2e0a",
    upcomingPillBorder: "#c8601a",
    upcomingStatusBg: "#fce4d4",
    upcomingStatusText: "#7a2e0a",
    upcomingDot: "#c8601a",

    // Status — finished (gray)
    finishedBorder: "#b0a590",
    finishedPillBg: "#e8e2d8",
    finishedPillText: "#3a3228",
    finishedPillBorder: "#7a6e60",
    finishedStatusBg: "#eae4da",
    finishedStatusText: "#6a5e50",
    finishedDot: "#9a8e7e",

    // Inactive pill / filter button
    inactivePillBg: "#d8d0c4",
    inactivePillBorder: "#c8c0b4",
    inactivePillText: "#2c2925",
    inactiveCntBg: "#a89e92",

    // Set score chips
    setBg: "#ede7da",
    setText: "#8a7d6a",

    // Category badge
    badgeBg: "#e5ddd0",
    badgeText: "#6a5e50",
    badgeBorder: "#cfc7b4",

    // Status — reported (yellow)
    reportedBorder: "#c8a800",
    reportedCardBg: "#fdfbee",
    reportedMetaBg: "#f7f2d4",
    reportedStatusBg: "#f5edbc",
    reportedStatusText: "#6a5800",
    reportedDot: "#c8a800",
} as const;

// ─── Theme ───────────────────────────────────────────────────────────────────

export const theme = createTheme({
    palette: {
        background: {
            default: colors.pageBg,
            paper: colors.cardBg,
        },
        text: {
            primary: colors.textPrimary,
            secondary: colors.textMuted,
        },
        divider: colors.borderLight,
    },

    typography: {
        fontFamily: "'DM Sans', sans-serif",
        body1: { fontSize: "14px" },
        body2: { fontSize: "12px" },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');
        body { background-color: ${colors.pageBg}; }
      `,
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderLight}`,
                    borderRadius: 8,
                    boxShadow: "none",
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "9.5px",
                    height: "20px",
                    backgroundColor: colors.badgeBg,
                    color: colors.badgeText,
                    border: `1px solid ${colors.badgeBorder}`,
                    borderRadius: "3px",
                },
            },
        },
    },
});

// ─── Status helpers ──────────────────────────────────────────────────────────
export type MatchStatus = "ongoing" | "upcoming" | "finished" | "reported";

export const statusColors: Record<
    MatchStatus,
    {
        borderLeft: string;
        cardBg: string;
        metaBg: string;
        pillBg: string;
        pillText: string;
        pillBorder: string;
        statusBg: string;
        statusText: string;
        dot: string;
        label: string;
    }
> = {
    ongoing: {
        borderLeft: colors.ongoingBorder,
        cardBg: colors.ongoingCardBg,
        metaBg: colors.ongoingMetaBg,
        pillBg: colors.ongoingPillBg,
        pillText: colors.ongoingPillText,
        pillBorder: colors.ongoingPillBorder,
        statusBg: colors.ongoingStatusBg,
        statusText: colors.ongoingStatusText,
        dot: colors.ongoingDot,
        label: "Live",
    },
    upcoming: {
        borderLeft: colors.upcomingBorder,
        cardBg: colors.cardBg,
        metaBg: colors.metaBg,
        pillBg: colors.upcomingPillBg,
        pillText: colors.upcomingPillText,
        pillBorder: colors.upcomingPillBorder,
        statusBg: colors.upcomingStatusBg,
        statusText: colors.upcomingStatusText,
        dot: colors.upcomingDot,
        label: "Upcoming",
    },
    finished: {
        borderLeft: colors.finishedBorder,
        cardBg: colors.cardBg,
        metaBg: colors.metaBg,
        pillBg: colors.finishedPillBg,
        pillText: colors.finishedPillText,
        pillBorder: colors.finishedPillBorder,
        statusBg: colors.finishedStatusBg,
        statusText: colors.finishedStatusText,
        dot: colors.finishedDot,
        label: "Done",
    },
    reported: {
        borderLeft: colors.reportedBorder,
        cardBg: colors.reportedCardBg,
        metaBg: colors.reportedMetaBg,
        pillBg: colors.reportedStatusBg,
        pillText: colors.reportedStatusText,
        pillBorder: colors.reportedBorder,
        statusBg: colors.reportedStatusBg,
        statusText: colors.reportedStatusText,
        dot: colors.reportedDot,
        label: "Reported",
    },
};