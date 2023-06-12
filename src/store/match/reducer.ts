import { createReducer } from "@reduxjs/toolkit"
import { TeamType, EventType, NotificationType, Event } from "../../components/types"
import { matchState } from "../types"
import {
  addAwayTeamType, addHomeTeamType, clearNotificationType, evaluateEventsType, insertEventType,
  MatchActionTypes, setMatchIdType, setTeamColorType, setTournamentIdType, storeEvents, storeEventsType, undoLastEventType,
  resetMatchIdType, resetAwayPlayerNameType, resetHomePlayerNameType, resetTeamColorType, resetTournamentIdType, storeMatchType, setIdType
} from "./actions"
import { v4 } from 'uuid';

const initState = {
  homeTeam: {
    player1Name: "",
    player2Name: "",
  },
  awayTeam: {
    player1Name: "",
    player2Name: "",
  },
  teamColor: { "HOME": "", "AWAY": "" },
  matchId: "null",
  tournamentId: "null",
  id: "",
  checkedDb: false,
  finished: false,
  showNotification: true,
  technicalTimeout: false,
  switchSide: false,
  noMirrorSides: false,
  matchStarted: false,
  startTime: 0,
  userMessage: "switch sides",
  firstServer: { "HOME": 0, "AWAY": 0 },
  firstServerTeam: TeamType.None,
  leftSideTeam: TeamType.None,
  currentSet: 0,
  currentSetScore: { "HOME": 0, "AWAY": 0 },
  currentScore: { "HOME": 0, "AWAY": 0 },
  teamTimeout: { "HOME": false, "AWAY": false },
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
  [MatchActionTypes.SET_ID]: (state: matchState, action: setIdType) => {
    return {
      ...state,
      id: action.payload
    }
  },
  [MatchActionTypes.SET_MATCH_ID]: (state: matchState, action: setMatchIdType) => {
    return {
      ...state,
      matchId: action.payload
    }
  },
  [MatchActionTypes.SET_TOURNEMENT_ID]: (state: matchState, action: setTournamentIdType) => {
    return {
      ...state,
      tournamentId: action.payload
    }
  },
  [MatchActionTypes.RESET_MATCH_ID]: (state: matchState, action: resetMatchIdType) => {
    state.matchId = "null"

  },
  [MatchActionTypes.RESET_TOURNEMENT_ID]: (state: matchState, action: resetTournamentIdType) => {
    state.tournamentId = "null"
  },
  [MatchActionTypes.RESET_HOME_PLAYER_NAME]: (state: matchState, action: resetHomePlayerNameType) => {
    if (action.payload === 1) {
      state.homeTeam.player1Name = "";
    } else {
      state.homeTeam.player2Name = "";
    }
  },
  [MatchActionTypes.RESET_AWAY_PLAYER_NAME]: (state: matchState, action: resetAwayPlayerNameType) => {
    if (action.payload === 1) {
      state.awayTeam.player1Name = "";
    } else {
      state.awayTeam.player2Name = "";
    }
  },
  [MatchActionTypes.RESET_TEAM_COLOR]: (state: matchState, action: resetTeamColorType) => {
    state.teamColor[action.payload] = "";
  },
  [MatchActionTypes.SET_TEAM_COLOR]: (state: matchState, action: setTeamColorType) => {
    state.teamColor[action.payload.team] = action.payload.color
  },
  [MatchActionTypes.INSERT_EVENT]: (state: matchState, action: insertEventType) => {
    if (action.payload.eventType === EventType.Score) {
      return {
        ...state,
        showNotification: true,
        events: [
          ...state.events,
          action.payload
        ]
      }
    }
    return {
      ...state,
      events: [
        ...state.events,
        action.payload
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
        reference: undoneEvent.id,
      }
    ];
    return {
      ...state,
      showNotification: true,
      events: updatedEvents
    };
  },
  [MatchActionTypes.EVALUATE_EVENTS]: (state: matchState, action: evaluateEventsType) => {
    const { events } = state;
    const sets: { [key: string]: number } = { [TeamType.Home]: 0, [TeamType.Away]: 0 };
    let homeSetScore = [0, 0, 0];
    let awaySetScore = [0, 0, 0];
    let currentSet = 1;
    let teamTimeout = { "HOME": false, "AWAY": false };
    let firstServer = { "HOME": 0, "AWAY": 0 };
    let firstServerTeam = TeamType.None;
    let leftSideTeam = TeamType.None;
    let noMirrorSides = false;
    let matchStarted = false;
    let matchStartTime = 0;
    let userMessage = "";
    events.forEach((event) => {
      if (event.undone) {
        return;
      }
      if (event.eventType === EventType.Score) {
        userMessage = "";
        if (!matchStarted) {
          matchStarted = true
        }
        if (matchStartTime === 0) {
          matchStartTime = event.timestamp
        }
        const setIndex = currentSet - 1;
        if (event.team === TeamType.Home) {
          homeSetScore[setIndex] += 1;
        } else {
          awaySetScore[setIndex] += 1;
        }
        if (currentSet === 1 || currentSet === 2) {
          if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 7 === 0) {
            if (leftSideTeam === TeamType.Home) {
              leftSideTeam = TeamType.Away
            } else {
              leftSideTeam = TeamType.Home
            }
          }
          if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 7 === 6) {
            userMessage = "switch sides"
          }
          if ((homeSetScore[setIndex] + awaySetScore[setIndex]) === 20) {
            userMessage = "technical timout"
          }
          if (homeSetScore[setIndex] >= 21 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
            sets[TeamType.Home] += 1;
            teamTimeout = { "HOME": false, "AWAY": false }
            firstServer = { "HOME": 0, "AWAY": 0 }
            firstServerTeam = TeamType.None;
            leftSideTeam = TeamType.None;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
            currentSet += 1;
            userMessage = "";
          } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
            sets[TeamType.Away] += 1;
            teamTimeout = { "HOME": false, "AWAY": false }
            firstServer = { "HOME": 0, "AWAY": 0 }
            firstServerTeam = TeamType.None;
            leftSideTeam = TeamType.None;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
            currentSet += 1;
            userMessage = "";
          }
        } else {
          if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 5 === 0) {
            if (leftSideTeam === TeamType.Home) {
              leftSideTeam = TeamType.Away
            } else {
              leftSideTeam = TeamType.Home
            }
          }
          if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 5 === 4) {
            userMessage = "switch sides"
          }
          if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
            sets[TeamType.Home] += 1;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
            userMessage = "";
          } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
            sets[TeamType.Away] += 1;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
            userMessage = "";
          }
        }
      } else if (event.eventType === EventType.Timeout && event.team !== TeamType.None) {
        teamTimeout[event.team] = true
      } else if (event.eventType === EventType.FirstPlayerServer && event.team !== TeamType.None) {
        firstServer[event.team] = event.playerId
      } else if (event.eventType === EventType.FirstTeamServer && event.team !== TeamType.None) {
        firstServerTeam = event.team
      } else if (event.eventType === EventType.LeftSideStartTeam && event.team !== TeamType.None) {
        leftSideTeam = event.team
      } else if (event.eventType === EventType.NoSideSwitch) {
        noMirrorSides = true
      }
    });
    const currentSetScore = {
      [TeamType.Home]: homeSetScore[currentSet - 1],
      [TeamType.Away]: awaySetScore[currentSet - 1],
    };
    let matchDone = sets[TeamType.Home] === 2 || sets[TeamType.Away] === 2;
    return {
      ...state,
      currentScore: currentSetScore,
      currentSetScore: sets,
      currentSet: currentSet,
      firstServer: firstServer,
      firstServerTeam: firstServerTeam,
      teamTimeout: teamTimeout,
      finished: matchDone,
      leftSideTeam: leftSideTeam,
      matchStarted: matchStarted,
      noMirrorSides: noMirrorSides,
      startTime: matchStartTime,
      userMessage: userMessage
    }
  },

  [MatchActionTypes.STORE_EVENTS]: (state: matchState, action: storeEventsType) => {
    console.log("In reducer store events");

    return {
      ...state,
      events: action.payload,
      checkDb: true
    }
  },

  [MatchActionTypes.STORE_MATCH]: (state: matchState, action: storeMatchType) => {
    console.log("In reducer store match");

    return {
      ...state,
      id: action.payload.id,
      matchId: action.payload.matchId,
      tournamentId: action.payload.tournamentId,
      homeTeam: action.payload.homeTeam,
      awayTeam: action.payload.awayTeam,
      teamColor: { "HOME": action.payload.homeColor, "AWAY": action.payload.awayColor },
      timestamp: action.payload.timestamp,
    }
  },

  [MatchActionTypes.CLEAR_NOTIFICATION]: (state: matchState, action: clearNotificationType) => {

    return {
      ...state,
      showNotification: false
    }
  }
})
