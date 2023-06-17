// reducer.tsx
import { updateMatchType, TournamentAdminTypes, fetchMatchesSuccessType, fetchMatchesFailureType } from './action';
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

// // Define the shape of the state
// export interface MatchesState {
//     matches: AdminMatch[];
//     error: string | null;
// }

// const initialState: MatchesState = {
//     matches: [],
//     error: null
// };

const initState: matchesState = {
    matches: {},
    errorMessage: null,
    lastUpdated: 0
};

// type MatchesActionTypes = FetchMatchesSuccessAction | FetchMatchesFailureAction;

// // Reducer
// export const matchesReducer = (state = initialState, action: MatchesActionTypes): MatchesState => {
//     switch (action.type) {
//         case FETCH_MATCHES_SUCCESS:
//             return { ...state, matches: action.payload };
//         case FETCH_MATCHES_FAILURE:
//             return { ...state, error: action.payload };
//         case TournamentAdminTypes.UPDATE_MATCH:
//             console.log(state.matches)
//             return { ...state};
//         default:
//             return state;
//     }
// };

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
})
