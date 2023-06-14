// action.tsx

import { createAction } from "@reduxjs/toolkit";
import { MatchSuccessPayload, MatchUpdatePayload } from "./reducer";

// Define and export the action types as string constants
export enum TournamentAdminTypes {
    FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST',
    UPDATE_MATCH = 'UPDATE_MATCH',
    FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS',
    FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE',
}

export const fetchMatchesSuccess = createAction<MatchSuccessPayload>(TournamentAdminTypes.FETCH_MATCHES_SUCCESS)
export const fetchMatchesFailure = createAction<string>(TournamentAdminTypes.FETCH_MATCHES_FAILURE)
export const fetchMatchesRequest = createAction<string>(TournamentAdminTypes.FETCH_MATCHES_REQUEST)
export const updateMatch = createAction<MatchUpdatePayload>(TournamentAdminTypes.UPDATE_MATCH)

export type fetchMatchesSuccessType = ReturnType<typeof fetchMatchesSuccess>
export type fetchMatchesFailureType = ReturnType<typeof fetchMatchesFailure>

export type fetchMatchesRequestType = ReturnType<typeof fetchMatchesRequest>

export type updateMatchType = ReturnType<typeof updateMatch>

// Define interfaces for the action payloads
interface FetchMatchesRequestPayload {
    tournamentSlug: string;
}
