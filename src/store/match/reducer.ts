import { createReducer } from "@reduxjs/toolkit"
import { TeamType, EventType, NotificationType, Event } from "../../components/types"
import { matchState } from "../types"
import { addAwayTeamType, addHomeTeamType, checkDb, clearNotificationType, evaluateEventsType, insertEventType, MatchActionTypes, setMatchIdType, setTournementIdType, storeEvents, storeEventsType, undoLastEventType } from "./actions"
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
  matchId: "",
  tournementId: "",
  checkedDb: false,
  finished: false,
  showNotification: true,
  technicalTimeout: false,
  switchSide: false,
  noMirrorSides: false,
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
  [MatchActionTypes.SET_MATCH_ID]: (state: matchState, action: setMatchIdType) => {
    return {
      ...state,
      matchId: action.payload
    }
  },
  [MatchActionTypes.SET_TOURNEMENT_ID]: (state: matchState, action: setTournementIdType) => {
    return {
      ...state,
      tournementId : action.payload
    }
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
    events.forEach((event) => {
      if (event.undone) {
        return;
      }
      if (event.eventType === EventType.Score) {
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
          if (homeSetScore[setIndex] >= 21 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
            sets[TeamType.Home] += 1;
            teamTimeout = { "HOME": false, "AWAY": false }
            firstServer = { "HOME": 0, "AWAY": 0 }
            firstServerTeam = TeamType.None;
            leftSideTeam = TeamType.None;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
            currentSet += 1;
          } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
            sets[TeamType.Away] += 1;
            teamTimeout = { "HOME": false, "AWAY": false }
            firstServer = { "HOME": 0, "AWAY": 0 }
            firstServerTeam = TeamType.None;
            leftSideTeam = TeamType.None;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
            currentSet += 1;
          }
        } else {
          if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 5 === 0) {
            if (leftSideTeam === TeamType.Home) {
              leftSideTeam = TeamType.Away
            } else {
              leftSideTeam = TeamType.Home
            }
          }
          if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
            sets[TeamType.Home] += 1;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
          } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
            sets[TeamType.Away] += 1;
            homeSetScore[setIndex] = 0;
            awaySetScore[setIndex] = 0;
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
      noMirrorSides: noMirrorSides
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

  // [MatchActionTypes.SHOW_NOTIFICATION]: (state: matchState, action: showNotificationType) => {
  //   let notificationType = evaluateScores(1)

  //   switch (notificationType) {
  //     case NotificationType.SwitchSides:
  //       return {
  //         ...state,
  //         switchSide: true,
  //         showNotification: true
  //       }
  //     case NotificationType.TechnicalTimeout:
  //       return {
  //         ...state,
  //         technicalTimeout: true,
  //         showNotification: true,
  //       }
  //     default:
  //       return {
  //         ...state
  //       }
  //   }
  // },

  [MatchActionTypes.CLEAR_NOTIFICATION]: (state: matchState, action: clearNotificationType) => {

    return {
      ...state,
      showNotification: false
    }
  }
})
