import { createAction } from '@reduxjs/toolkit'
import { TeamType, NotificationType, Team, Event } from '../../components/types'

export interface AddEventPayload {
  matchId: string;
  event: Event;
}

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum MatchActionTypes {
  CHECK_DB = 'CHECK_DB',
  STORE_EVENTS = 'STORE_EVENTS',

  SET_MATCH_ID = 'SET_MATCH_ID',
  SET_TOURNEMENT_ID = 'SET_TOURNEMENT_ID',

  ADD_HOME_TEAM = 'ADD_HOME_TEAM',
  ADD_AWAY_TEAM = 'ADD_AWAY_TEAM',

  CALL_TIMEOUT = 'CALL_TIMEOUT',
  SWITCH_SIDES = 'SWITCH_SIDES',

  UPDATE_SCORES = 'UPDATE_SCORES',

  TECHNICAL_TIMEOUT = 'CALL_TIMEOUT',
  EVALUATE_EVENTS = 'EVALUATE_EVENTS',

  CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION',

  ADD_TEAM_ERROR = 'ADD_TEAM_ERROR',

  ADD_EVENT = 'ADD_EVENT',
  UNDO_LAST_EVENT = 'UNDO_LAST_EVENT',

  INSERT_EVENT = 'INSERT_EVENT',
  UNDO_EVENT = 'UNDO_EVENT',

  NO_MIRROR_SIDES = 'NO_MIRROR_SIDES',
  TEAM_START_LEFT = 'TEAM_START_LEFT',
}
export const checkDb = createAction<string>(MatchActionTypes.CHECK_DB)
export const storeEvents = createAction<Event[]>(MatchActionTypes.STORE_EVENTS)

export const setMatchId = createAction<string>(MatchActionTypes.SET_MATCH_ID)
export const setTournementId = createAction<string>(MatchActionTypes.SET_TOURNEMENT_ID)

export const addHomeTeam = createAction<Team>(MatchActionTypes.ADD_HOME_TEAM)
export const addAwayTeam = createAction<Team>(MatchActionTypes.ADD_AWAY_TEAM)

export const updateScores = createAction<TeamType>(MatchActionTypes.UPDATE_SCORES)

export const clearNotification = createAction(MatchActionTypes.CLEAR_NOTIFICATION)

export const addTeamError = createAction<Error>(MatchActionTypes.ADD_TEAM_ERROR)

export const addEvent = createAction<AddEventPayload>(MatchActionTypes.ADD_EVENT)
export const undoEvent = createAction<AddEventPayload>(MatchActionTypes.UNDO_EVENT)

export const insertEvent = createAction<Event>(MatchActionTypes.INSERT_EVENT)
export const undoLastEvent = createAction(MatchActionTypes.UNDO_LAST_EVENT)

export const noMirrorSides = createAction(MatchActionTypes.NO_MIRROR_SIDES)
export const teamStartLeft = createAction<TeamType>(MatchActionTypes.TEAM_START_LEFT)

export const evaluateEvents = createAction(MatchActionTypes.EVALUATE_EVENTS)

export type checkDbType = ReturnType<typeof checkDb>
export type storeEventsType = ReturnType<typeof storeEvents>

export type setMatchIdType = ReturnType<typeof setMatchId>
export type setTournementIdType = ReturnType<typeof setTournementId>

export type addHomeTeamType = ReturnType<typeof addHomeTeam>
export type addAwayTeamType = ReturnType<typeof addAwayTeam>

export type addEventType = ReturnType<typeof addEvent>
export type undoEventType = ReturnType<typeof undoEvent>

export type insertEventType = ReturnType<typeof insertEvent>
export type undoLastEventType = ReturnType<typeof undoLastEvent>

export type noMirrorSidesType = ReturnType<typeof noMirrorSides>
export type teamStartLeftType = ReturnType<typeof teamStartLeft>

export type evaluateEventsType = ReturnType<typeof evaluateEvents>

export type clearNotificationType = ReturnType<typeof clearNotification>

export type addTeamErrorType = ReturnType<typeof addTeamError>
