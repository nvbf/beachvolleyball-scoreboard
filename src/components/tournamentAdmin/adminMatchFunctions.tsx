import { DocumentData } from "firebase/firestore";
import { AdminMatch } from "./types";

export function parseAdminMatch(data: DocumentData): AdminMatch {
    return {
        matchId: data.Number,
        awayTeam: {
            isWinner: data.AwayTeam?.IsWinner || false,
            name: data.AwayTeam?.Name
        },
        currentScore: data.CurrentScore,
        currentSetScore: data.CurrentSetScore,
        date: data.Date,
        arenaName: data.Field?.Arena?.ArenaName,
        hasWinner: data.HasWinner,
        homeTeam: {
            isWinner: data.HomeTeam?.IsWinner || false,
            name: data.HomeTeam?.Name
        },
        matchCategory: data.MatchCategory?.CategoryCode,
        matchGroup: data.MatchGroup?.DisplayName,
        name: data.Name,
        scoreboardID: data.ScoreboardId
    };
}