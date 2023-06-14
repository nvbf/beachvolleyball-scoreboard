// reducer.tsx
import { FETCH_MATCHES_SUCCESS, FETCH_MATCHES_FAILURE } from './action';
import{Match} from "./../../components/tournamentAdmin/types"


// Define the shape of the state
export interface MatchesState {
    matches: Match[];
    error: string | null;
}

const initialState: MatchesState = {
    matches: [],
    error: null
};

// Define action types
interface FetchMatchesSuccessAction {
    type: typeof FETCH_MATCHES_SUCCESS;
    payload: Match[];
}

interface FetchMatchesFailureAction {
    type: typeof FETCH_MATCHES_FAILURE;
    payload: string;
}

type MatchesActionTypes = FetchMatchesSuccessAction | FetchMatchesFailureAction;

// Reducer
export const matchesReducer = (state = initialState, action: MatchesActionTypes): MatchesState => {
    switch (action.type) {
        case FETCH_MATCHES_SUCCESS:
//console.log("Data received in reducer: ", action.payload);
            return { ...state, matches: action.payload };
        case FETCH_MATCHES_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
