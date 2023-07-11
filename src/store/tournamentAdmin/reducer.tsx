// reducer.tsx
import { updateMatchType, TournamentAdminTypes, fetchMatchesSuccessType, fetchMatchesFailureType, fetchFieldsSuccessType, fetchDatesSuccessType, chooseCourtType, chooseDayType } from './action';
import { AdminMatch } from "./../../components/tournamentAdmin/types"
import { createReducer } from "@reduxjs/toolkit"
import { matchesState } from '../types';


export interface MatchUpdatePayload {
    matchId: number;
    match: AdminMatch;
}

export interface MatchSuccessPayload {
    matches: AdminMatch[];
}

const initState: matchesState = {
    matches: {},
    dates: [],
    fields: [],
    selectedDay: "all",
    selectedCourt: "all",
    errorMessage: null,
    lastUpdated: 0
};

export const matchesReducer = createReducer<matchesState>(initState, {

    [TournamentAdminTypes.FETCH_MATCHES_SUCCESS]: (state: matchesState, action: fetchMatchesSuccessType) => {
        const matchesArray: AdminMatch[] = action.payload.matches;
        state.matches = matchesArray.reduce((obj, match) => ({ ...obj, [match.matchId]: match }), {});
    },

    [TournamentAdminTypes.FETCH_MATCHES_FAILURE]: (state: matchesState, action: fetchMatchesFailureType) => {
        return { ...state, error: action.payload };
    },

    [TournamentAdminTypes.UPDATE_MATCH]: (state: matchesState, action: updateMatchType) => {
        state.matches[action.payload.matchId] = action.payload.match
    },

    [TournamentAdminTypes.CHOOSE_COURT]: (state: matchesState, action: chooseCourtType) => {
        return { ...state, selectedCourt: action.payload };
    },

    [TournamentAdminTypes.CHOOSE_DAY]: (state: matchesState, action: chooseDayType) => {
        return { ...state, selectedDay: action.payload };
    },

    [TournamentAdminTypes.FETCH_MATCH_DATES_SUCCESS]: (state: matchesState, action: fetchDatesSuccessType) => {
        let today = new Date().toISOString().split('T')[0]
        let selectedDay = "all"
        if (action.payload.includes(today)) {
            selectedDay = today
        }
        return { ...state, dates: action.payload, selectedDay: selectedDay };
    },

    [TournamentAdminTypes.FETCH_MATCH_FIELDS_SUCCESS]: (state: matchesState, action: fetchFieldsSuccessType) => {
        return { ...state, fields: action.payload };
    },
})
