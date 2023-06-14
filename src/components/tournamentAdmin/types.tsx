// Define the structure of match data
export interface Match {
    awayTeam: {
        split(arg0: string): [any, any];
        isWinner: boolean;
        name: string;
    };
    currentScore: { [key: string]: number }[];
    currentSetScore: { [key: string]: number };
    date: string;
    arenaName: string;
    hasWinner: boolean;
    homeTeam: {
        split(arg0: string): [any, any];
        isWinner: boolean;
        name: string;
    };
    matchCategory: string;
    matchGroup: string;
    name: string;
    scoreboardID: string;
}