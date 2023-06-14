// Define the structure of match data
export interface AdminMatch {
    matchId: number;
    awayTeam: {
        isWinner: boolean;
        name: string;
    };
    currentScore: { [key: string]: number }[];
    currentSetScore: { [key: string]: number };
    startTime: number;
    arenaName: string;
    hasWinner: boolean;
    isFinalized: boolean;
    isStarted: boolean;
    homeTeam: {
        isWinner: boolean;
        name: string;
    };
    matchCategory: string;
    matchGroup: string;
    name: string;
    scoreboardID: string;
}
