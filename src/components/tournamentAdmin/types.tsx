// Define the structure of match data
export interface AdminMatch {
    matchId: number;
    awayTeam: {
        isWinner: boolean;
        name: string;
        player1: string;
        player2: string;
    };
    currentScore: { [key: string]: number }[];
    currentSetScore: { [key: string]: number };
    sets: { [key: string]: number }[];
    startTime: number;
    startTimestamp: number;
    arenaName: string;
    hasWinner: boolean;
    isFinalized: boolean;
    isStarted: boolean;
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
    scoreboardID: string;
}

export enum MatchState {
    Finished = "FINISHED",
    Reported = "REPORTED",
    Ongoing = "ONGOING",
    Upcoming = "UPCOMING",
}