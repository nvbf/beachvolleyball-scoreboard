import { createReducer } from "@reduxjs/toolkit"
import { Actor, EventType } from "../../components/types"
import { isSetDone } from "../../util/functions"
import { matchState } from "../types"
import { addAwayTeamType, addHomeTeamType, addPointType, MatchActionTypes } from "./actions"

const initState = {
  homeTeam: {
    player1Name: "Haidar Nuri",
    player2Name: "Øystein Grændsen",
    shirtColor: "#0000ff",
    added: true,
  },
  awayTeam: {
    player1Name: "Frode Walde",
    player2Name: "Ståle Mygland",
    shirtColor: "#ff0000",
    added: true,
  },
  currentSet: 0,
  matchId: "",
  homeTimeout: false,
  awayTimeout: false,
  tournementId: -1,
  events: [],
  sets: [
    {
      homeTeamScore: 1,
      awayTeamScore: 0
    },
    {
      homeTeamScore: 0,
      awayTeamScore: 0
    },
    {
      homeTeamScore: 0,
      awayTeamScore: 0
    }
  ],
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
  [MatchActionTypes.ADD_POINT]: (state, action: addPointType) => {
    const nextSets = [
      {...state.sets[0]},
      {...state.sets[1]},
      {...state.sets[2]}
    ]
    if (action.payload === Actor.HomeTeam) {
      nextSets[state.currentSet].homeTeamScore++
    } else {
      nextSets[state.currentSet].awayTeamScore++
    }
    
    return {
      ...state,
      sets: nextSets,
      currentSet: isSetDone(nextSets[state.currentSet], state.currentSet) 
        ? state.currentSet + 1 : state.currentSet,
      events: [
        ...state.events,
        {
          eventType: EventType.Score,
          actor: action.payload,
          timestamp: new Date(),
          undone: false
        }
      ]
    }
  },
})
