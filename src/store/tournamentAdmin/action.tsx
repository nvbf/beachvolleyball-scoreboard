import { createAction } from "@reduxjs/toolkit";
import { MatchSuccessPayload, MatchUpdatePayload } from "./reducer";

// Define and export the action types as string constants
export enum TournamentAdminTypes {
    FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST',
    UPDATE_MATCH = 'UPDATE_MATCH',
    FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS',
    FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE',
    FETCH_MATCH_DATES_SUCCESS = 'FETCH_MATCH_DATES_SUCCESS',
    FETCH_MATCH_FIELDS_SUCCESS = 'FETCH_MATCH_FIELDS_SUCCESS',

    CHOOSE_DAY = 'CHOOSE_DAY',
    CHOOSE_COURT = 'CHOOSE_COURT',

}

export const fetchMatchesSuccess = createAction<MatchSuccessPayload>(TournamentAdminTypes.FETCH_MATCHES_SUCCESS)
export const fetchMatchesFailure = createAction<string>(TournamentAdminTypes.FETCH_MATCHES_FAILURE)
export const fetchMatchesRequest = createAction<string>(TournamentAdminTypes.FETCH_MATCHES_REQUEST)
export const updateMatch = createAction<MatchUpdatePayload>(TournamentAdminTypes.UPDATE_MATCH)

export const fetchFieldsSuccess = createAction<string[]>(TournamentAdminTypes.FETCH_MATCH_FIELDS_SUCCESS)
export const fetchDatesSuccess = createAction<string[]>(TournamentAdminTypes.FETCH_MATCH_DATES_SUCCESS)

export const chooseDay = createAction<string>(TournamentAdminTypes.CHOOSE_DAY)
export const chooseCourt = createAction<string>(TournamentAdminTypes.CHOOSE_COURT)

export type fetchMatchesSuccessType = ReturnType<typeof fetchMatchesSuccess>
export type fetchMatchesFailureType = ReturnType<typeof fetchMatchesFailure>
export type fetchMatchesRequestType = ReturnType<typeof fetchMatchesRequest>
export type updateMatchType = ReturnType<typeof updateMatch>

export type fetchFieldsSuccessType = ReturnType<typeof fetchFieldsSuccess>
export type fetchDatesSuccessType = ReturnType<typeof fetchDatesSuccess>

export type chooseDayType = ReturnType<typeof chooseDay>
export type chooseCourtType = ReturnType<typeof chooseCourt>
