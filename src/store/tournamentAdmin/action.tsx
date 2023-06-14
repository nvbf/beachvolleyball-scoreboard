// action.tsx

import { createAction } from "@reduxjs/toolkit";

// Define and export the action types as string constants
export enum TournamentAdminTypes {
    FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST'
}
export const FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS';
export const FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE';


export const fetchMatchesRequest = createAction<string>(TournamentAdminTypes.FETCH_MATCHES_REQUEST)


export type fetchMatchesRequestType = ReturnType<typeof fetchMatchesRequest>
// Define interfaces for the action payloads
interface FetchMatchesRequestPayload {
    tournamentSlug: string;
}

interface MatchData {
    awayTeam: {
        isWinner: boolean;
        name: string;
    };
    currentScore: any; // Define a more specific type if possible
    currentSetScore: any; // Define a more specific type if possible
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

// // Define the action interfaces
// interface FetchMatchesRequestAction {
//     type: typeof FETCH_MATCHES_REQUEST;
//     payload: FetchMatchesRequestPayload;
// }

interface FetchMatchesSuccessAction {
    type: typeof FETCH_MATCHES_SUCCESS;
    payload: MatchData[];
}

interface FetchMatchesFailureAction {
    type: typeof FETCH_MATCHES_FAILURE;
    payload: string;
}

// // Action creators
// export const fetchMatchesRequest = (tournamentSlug: string): FetchMatchesRequestAction => ({
//     type: FETCH_MATCHES_REQUEST,
//     payload: { tournamentSlug }
// });

export const fetchMatchesSuccess = (matches: MatchData[]): FetchMatchesSuccessAction => ({
    type: FETCH_MATCHES_SUCCESS,
    payload: matches
});

export const fetchMatchesFailure = (error: string): FetchMatchesFailureAction => ({
    type: FETCH_MATCHES_FAILURE,
    payload: error
});
