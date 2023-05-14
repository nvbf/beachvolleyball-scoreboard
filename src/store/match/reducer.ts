import { createReducer } from "@reduxjs/toolkit"
import { TeamType, EventType, NotificationType, Event } from "../../components/types"
import { evaluateScores, isSetDone } from "../../util/evaluateScore"
import { matchState } from "../types"
import { addAwayTeamType, addHomeTeamType, addPointType, callTimeoutType, clearNotificationType, firstServerAwayType, firstServerHomeType, firstServerTeamType, MatchActionTypes, pickAwayColorType, pickHomeColorType, showNotificationType, undoLastEventType } from "./actions"
import { v4 } from 'uuid';

const initState = {
  homeTeam: {
    player1Name: "Haidar Nuri",
    player2Name: "Øystein William Grændsen",
    shirtColor: "#111111",
    added: true,
  },
  awayTeam: {
    player1Name: "Frode Walde",
    player2Name: "Ståle Mygland",
    shirtColor: "#eeeeee",
    added: true,
  },
  matchId: "",
  finished: false,
  showNotification: false,
  technicalTimeout: false,
  teamTimeout: false,
  switchSide: false,
  tournementId: -1,

  events: [

  ],
  shouldUpdate: false,
  errorMessage: null,
}

export const matchReducer = createReducer<matchState>(initState, {
  [MatchActionTypes.ADD_HOME_TEAM]: (state: matchState, action: addHomeTeamType) => {
    return {
      ...state,
      homeTeam: action.payload
    }
  },
  [MatchActionTypes.ADD_AWAY_TEAM]: (state: matchState, action: addAwayTeamType) => {
    return {
      ...state,
      awayTeam: action.payload
    }
  },

  [MatchActionTypes.ADD_POINT]: (state: matchState, action: addPointType) => {
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
          author: "",
          reference: ""
        }
      ]
    }
  },

  [MatchActionTypes.FIRST_SERVER_TEAM]: (state: matchState, action: firstServerTeamType) => {
    return {
      ...state,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.FirstTeamServer,
          team: action.payload,
          playerId: 0,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: ""
        }
      ]
    }
  },

  [MatchActionTypes.FIRST_SERVER_HOME]: (state: matchState, action: firstServerHomeType) => {
    return {
      ...state,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.FirstPlayerServer,
          team: TeamType.Home,
          playerId: action.payload,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: ""
        }
      ]
    }
  },

  [MatchActionTypes.FIRST_SERVER_AWAY]: (state: matchState, action: firstServerAwayType) => {
    return {
      ...state,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.FirstPlayerServer,
          team: TeamType.Away,
          playerId: action.payload,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: ""
        }
      ]
    }
  },

  [MatchActionTypes.PICK_HOME_COLOR]: (state: matchState, action: pickHomeColorType) => {
    return {
      ...state,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.PickColor,
          team: TeamType.Home,
          playerId: 0,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: action.payload
        }
      ]
    }
  },

  [MatchActionTypes.PICK_AWAY_COLOR]: (state: matchState, action: pickAwayColorType) => {
    return {
      ...state,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.PickColor,
          team: TeamType.Away,
          playerId: 0,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: action.payload
        }
      ]
    }
  },

  [MatchActionTypes.UNDO_LAST_EVENT]: (state: matchState, action: undoLastEventType) => {
    const { events } = state;
    const reversedEvents = [...events].reverse();
    const undoneEventIndex = reversedEvents.findIndex((event: Event) => !event.undone && event.eventType !== EventType.Undo);
    if (undoneEventIndex < 0) {
      return state;
    }
    const actualIndex = undoneEventIndex >= 0 ? events.length - 1 - undoneEventIndex : -1;

    const undoneEvent = events[actualIndex];
    const undoId = v4();
    const updatedEvents = [
      ...events.slice(0, actualIndex),
      { ...undoneEvent, undone: undoId },
      ...events.slice(actualIndex + 1, events.length),
      {
        id: undoId,
        eventType: EventType.Undo,
        team: undoneEvent.team,
        playerId: undoneEvent.playerId,
        timestamp: Date.now(),
        undone: "",
        author: "",
        reference: undoneEvent.id
      }
    ];
    return {
      ...state,
      events: updatedEvents
    };
  },

  [MatchActionTypes.SHOW_NOTIFICATION]: (state: matchState, action: showNotificationType) => {
    let notificationType = evaluateScores(1)

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

  [MatchActionTypes.CALL_TIMEOUT]: (state: matchState, action: callTimeoutType) => {
    let isHomeTeam = action.payload === TeamType.Home ? true : false
    return {
      ...state,
      teamTimeout: true,
      showNotification: true,
      events: [
        ...state.events,
        {
          id: v4(),
          eventType: EventType.Timeout,
          team: action.payload,
          playerId: 0,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: ""
        }
      ]
    }
  },

  [MatchActionTypes.CLEAR_NOTIFICATION]: (state: matchState, action: clearNotificationType) => {
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
