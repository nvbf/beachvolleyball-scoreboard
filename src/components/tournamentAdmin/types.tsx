// Define the structure of match data
export interface Match {
    awayTeam: {
        isWinner: boolean;
        name: string;
    };
    currentScore: any;
    currentSetScore: {
        away: number;
        home: number;
    };
    date: string;
    arenaName: string;
    hasWinner: boolean;
    homeTeam: {
        isWinner: boolean;
        name: string;
    };
    matchCategory: string;
    matchGroup: string;
    name: string;
    scoreboardID: string;
}