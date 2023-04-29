import { createReducer } from "@reduxjs/toolkit"
import { TeamType, EventType, NotificationType } from "../../components/types"
import { evaluateScores, isSetDone } from "../../util/evaluateScore"
import { matchState } from "../types"
import { addAwayTeamType, addHomeTeamType, addPointType, clearNotificationType, MatchActionTypes, showNotificationType } from "./actions"
import { throwError } from "redux-saga-test-plan/providers"
import { v4 } from 'uuid';

const initState = {
  homeTeam: {
    player1Name: "Haidar Nuri",
    player2Name: "Øystein William Grændsen",
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
  finished: false,
  showNotification: false,
  technicalTimeout: false,
  teamTimeout: false,
  switchSide: false,
  tournementId: -1,
  
  events: [
    {
      id: v4(),
      eventType: EventType.FirstTeamServer,
      team: TeamType.Away,
      playerId: 0,
      timestamp: Date.now()
    },
    {
      id: v4(),
      eventType: EventType.FirstPlayerServer,
      team: TeamType.Away,
      playerId: 1,
      timestamp: Date.now()
    },
    {
      id: v4(),
      eventType: EventType.FirstPlayerServer,
      team: TeamType.Home,
      playerId: 2,
      timestamp: Date.now()
    },
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
    return {
      ...state,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.Score,
          team: action.payload,
          playerId: 0,
          timestamp: Date.now(),
          undone: "",
          author: ""
        }
      ]
    }
  },

  [MatchActionTypes.SHOW_NOTIFICATION]: (state, action: showNotificationType) => {
    let notificationType = evaluateScores(state.currentSet)

    switch (notificationType) {
      case NotificationType.SwitchSides:
        return {
          ...state,
          switchSide: true,
          showNotification: true
        }
      case NotificationType.TechnicalTimeout:
        return {
          ...state,
          technicalTimeout: true,
          showNotification: true,
        }
      default:
        return {
          ...state
        }
    }
  },

  [MatchActionTypes.CALL_TIMEOUT]: (state, action: showNotificationType) => {
    let isHomeTeam = action.payload === TeamType.Home ? true : false
    return {
      ...state,
      homeTimeout: isHomeTeam || state.homeTimeout,
      awayTimeout: !isHomeTeam || state.awayTimeout,
      teamTimeout: true,
      showNotification: true,
    }
  },

  [MatchActionTypes.CLEAR_NOTIFICATION]: (state, action: clearNotificationType) => {
    switch (action.payload) {
      case NotificationType.SwitchSides:
        return {
          ...state,
          switchSide: false,
          showNotification: false
        }
      case NotificationType.TeamTimeout:
        return {
          ...state,
          teamTimeout: false,
          showNotification: false,
        }
      case NotificationType.TechnicalTimeout:
        return {
          ...state,
          technicalTimeout: false,
          showNotification: false,
        }
      default:
        return {
          ...state,
          showNotification: false
        }
    }
  },
})
