import { createReducer} from "@reduxjs/toolkit"
import { teamState } from "../types"
import { addAwayTeamType, addHomeTeamType, TeamActionTypes } from "./actions"

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
  shouldUpdate: false,
  errorMessage: null,
}

export const teamsReducer = createReducer<teamState>(initState, {
  [TeamActionTypes.ADD_HOME_TEAM]: (state, action: addHomeTeamType) => {
    return {
      ...state,
      homeTeam: action.payload
    }
  },
  [TeamActionTypes.ADD_AWAY_TEAM]: (state, action: addAwayTeamType) => {
    return {
      ...state,
      awayTeam: action.payload
    }
  },
})
