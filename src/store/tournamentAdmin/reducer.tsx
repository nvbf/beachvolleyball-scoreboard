import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminMatch } from "./../../components/tournamentAdmin/types"
import { adminState } from '../types';

export interface MatchUpdatePayload {
    matchId: number;
    match: AdminMatch;
}

export interface FetchMatchsPayload {
    tournamentSlug: string;
    class: string | null;
}

export interface MatchSuccessPayload {
    matches: AdminMatch[];
}

const initState: adminState = {
    matches: {},
    dates: [],
    fields: [],
    selectedDay: "all",
    selectedCourt: "all",
    errorMessage: "",
    lastUpdated: 0
};

const adminSlice = createSlice({
    name: 'admin',
    initialState: initState,
    reducers: {
        fetchMatchesRequest: (state, action: PayloadAction<FetchMatchsPayload>) => { }, // dummy reducer
        fetchMatchesSuccess: (state, action: PayloadAction<MatchSuccessPayload>) => {
            const matchesArray: AdminMatch[] = action.payload.matches;
            state.matches = matchesArray.reduce((obj, match) => ({ ...obj, [match.matchId]: match }), {});
        },
        fetchMatchesFailure: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        updateMatch: (state, action: PayloadAction<MatchUpdatePayload>) => {
            state.matches[action.payload.matchId] = action.payload.match;
        },
        chooseCourt: (state, action: PayloadAction<string>) => {
            state.selectedCourt = action.payload;
        },
        chooseDay: (state, action: PayloadAction<string>) => {
            state.selectedDay = action.payload;
        },
        fetchMatchDatesSuccess: (state, action: PayloadAction<string[]>) => {
            let today = new Date().toISOString().split('T')[0];
            let selectedDay = "all";
            if (action.payload.includes(today)) {
                selectedDay = today;
            }
            state.dates = action.payload;
            state.selectedDay = selectedDay;
        },
        fetchMatchFieldsSuccess: (state, action: PayloadAction<string[]>) => {
            state.fields = action.payload;
        },
    }
});

export const {
    fetchMatchesSuccess,
    fetchMatchesFailure,
    fetchMatchesRequest,
    updateMatch,
    chooseCourt,
    chooseDay,
    fetchMatchDatesSuccess,
    fetchMatchFieldsSuccess
} = adminSlice.actions;

export default adminSlice.reducer;
