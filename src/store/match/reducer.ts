import { createReducer} from "@reduxjs/toolkit"
import { matchState } from "../types"
import { addAwayTeamType, addHomeTeamType, MatchActionTypes } from "./actions"

const initState = {
  homeTeam: {
    player1Name: "",
    player2Name: "",
    shirtColor: "#0000ff",
    added: false
  },
  awayTeam: {
    player1Name: "",
    player2Name: "",
    shirtColor: "#ff0000",
    added: false
  },
  matchId: "",
  tournementId: -1,
  events: [],
  sets: [],
  shouldUpdate: false,
  errorMessage: null,
}

export const matchReducer = createReducer<matchState>(initState, {
  [MatchActionTypes.ADD_HOME_TEAM]: (state, action: addHomeTeamType) => {
    return {
      ...state,
      homeTeam: action.payload
    }
  },
  [MatchActionTypes.ADD_AWAY_TEAM]: (state, action: addAwayTeamType) => {
    return {
      ...state,
      awayTeam: action.payload
    }
  },
})
