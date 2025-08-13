// Define the structure of match data
import {TeamType} from "../types";


export type HomeAndAwayTeamScore = {
    [TeamType.Home]: number,
    [TeamType.Away]: number,
};

type SetScore = {
        "PointsHomeTeam": number,
        "PointsAwayTeam": number,
        "Number": number
    };

export interface AdminMatch {
    matchId: number;
    awayTeam: {
        isWinner: boolean;
        name: string;
        player1: string;
        player2: string;
    };
    currentScore: HomeAndAwayTeamScore[];
    currentSetScore: HomeAndAwayTeamScore;
    sets: SetScore[];
    startTime: number;
    startTimestamp: number;
    arenaName: string;
    hasWinner: boolean;
    isFinalized?: boolean;
    isStarted?: boolean;
    referee: string;
    homeTeam: {
        isWinner: boolean;
        name: string;
        player1: string;
        player2: string;
    };
    matchCategory: string;
    matchGroup: string;
    name: string;
    scoreboardID?: string;
}

// The server send some broken data, we normalize it before use
export type AdminMatchServerResponse = Omit<AdminMatch, "currentScore" | "currentSetScore"> & {
    currentScore: HomeAndAwayTeamScore[]|HomeAndAwayTeamScore;
    currentSetScore: HomeAndAwayTeamScore|[];
}

export enum MatchState {
    Finished = "FINISHED",
    Reported = "REPORTED",
    Ongoing = "ONGOING",
    Upcoming = "UPCOMING",
}