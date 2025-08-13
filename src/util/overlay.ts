import {
    AdminMatch,
    AdminMatchServerResponse,
    HomeAndAwayTeamScore
} from "../components/tournamentAdmin/types";
import {TeamType} from "../components/types";

export const getCurrentMatch = (
    matches: AdminMatch[],
    courtID: string,
): AdminMatch => {
    return matches.filter(
        (e) =>
            !e.hasWinner && !e.isFinalized && e.isStarted && e.arenaName === courtID,
    )[0];
};

export const getComingMatches = (
    matches: AdminMatch[],
    courtID: string,
): AdminMatch[] => {
    console.log(matches);
    return matches
        .filter(
            (e) =>
                !e.hasWinner &&
                !e.isFinalized &&
                !e.isStarted &&
                e.arenaName === courtID,
        )
        .sort((a, b) => a.startTime - b.startTime)
        .slice(0, 5);
};

export const normalizeServerMatches = (
    matches: AdminMatchServerResponse[]): AdminMatch[] => {
    return matches.map(match => {
        return {
            ...match,
            currentScore: normalizeCurrentScore(match.currentScore),
            currentSetScore: normalizeCurrentSetScore(match.currentSetScore)
        }
    });
}

function isSetScore(v: unknown): v is HomeAndAwayTeamScore {
    if (!v || typeof v !== "object") return false;
    // Adjust keys if TeamType is numeric enum, e.g., TeamType.Home = 0
    return (
        (TeamType.Home in (v as any)) &&
        (TeamType.Away in (v as any)) &&
        typeof (v as any)[TeamType.Home] === "number" &&
        typeof (v as any)[TeamType.Away] === "number"
    );
}

function isSetScoreArray(v: unknown): v is HomeAndAwayTeamScore[] {
    return Array.isArray(v) && v.every(isSetScore);
}

function normalizeCurrentScore(v: unknown): HomeAndAwayTeamScore[] {
    if (isSetScoreArray(v)) return v;
    if (isSetScore(v)) return [v];
    // e.g., [], null, wrong shape => treat as empty history
    return [];
}

const EMPTY_SET_SCORE: HomeAndAwayTeamScore = { [TeamType.Home]: 0, [TeamType.Away]: 0 };

function normalizeCurrentSetScore(v: unknown): HomeAndAwayTeamScore {
    if (isSetScore(v)) return v;

    // If array was mistakenly sent, pick the last valid frame if any
    if (Array.isArray(v)) {
        for (let i = v.length - 1; i >= 0; i--) {
            if (isSetScore((v as unknown[])[i])) return (v as HomeAndAwayTeamScore[])[i];
        }
    }

    // Fallback
    return EMPTY_SET_SCORE;
}