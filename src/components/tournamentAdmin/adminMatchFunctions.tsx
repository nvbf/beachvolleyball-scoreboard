import { DocumentData } from "firebase/firestore";
import { AdminMatch } from "./types";

export function parseAdminMatch(data: DocumentData): AdminMatch {
    return {
        matchId: +(data.Number),
        awayTeam: {
            isWinner: data.AwayTeam?.IsWinner || false,
            name: data.AwayTeam?.Name
        },
        currentScore: data.CurrentScore || { ["HOME"]: 0, ["AWAY"]: 0 },
        currentSetScore: data.CurrentSetScore || [],
        startTime: convertToTimestamp(data.Time, data.Date),
        arenaName: data.Field?.Name,
        isStarted: data.IsStarted,
        isFinalized: data.IsFinalized,
        hasWinner: data.HasWinner,
        homeTeam: {
            isWinner: data.HomeTeam?.IsWinner || false,
            name: data.HomeTeam?.Name
        },
        matchCategory: data.MatchCategory?.CategoryCode,
        matchGroup: data.MatchGroup?.Name,
        name: data.Name,
        scoreboardID: data.ScoreboardId,
    };
}

function convertToTimestamp(time: string, date: string): number {
    const dateStr = `${date}T${time}`;
    const dateObj = new Date(dateStr);

    // convert to milliseconds since epoch
    const timestampInMilliseconds = dateObj.getTime();

    return timestampInMilliseconds;
}