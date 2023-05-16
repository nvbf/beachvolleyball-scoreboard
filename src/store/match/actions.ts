import { createAction } from '@reduxjs/toolkit'
import { TeamType, NotificationType, Team, Event } from '../../components/types'

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum MatchActionTypes {
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
}

export const addHomeTeam = createAction<Team>(MatchActionTypes.ADD_HOME_TEAM)
export const addAwayTeam = createAction<Team>(MatchActionTypes.ADD_AWAY_TEAM)

export const updateScores = createAction<TeamType>(MatchActionTypes.UPDATE_SCORES)

export const clearNotification = createAction(MatchActionTypes.CLEAR_NOTIFICATION)

export const addTeamError = createAction<Error>(MatchActionTypes.ADD_TEAM_ERROR)

export const addEvent = createAction<Event>(MatchActionTypes.ADD_EVENT)
export const undoLastEvent = createAction(MatchActionTypes.UNDO_LAST_EVENT)

export const insertEvent = createAction<Event>(MatchActionTypes.INSERT_EVENT)
export const undoEvent = createAction(MatchActionTypes.UNDO_EVENT)

export const evaluateEvents = createAction(MatchActionTypes.EVALUATE_EVENTS)

export type addHomeTeamType = ReturnType<typeof addHomeTeam>
export type addAwayTeamType = ReturnType<typeof addAwayTeam>

export type addEventType = ReturnType<typeof addEvent>
export type undoLastEventType = ReturnType<typeof undoLastEvent>

export type insertEventType = ReturnType<typeof insertEvent>
export type undoEventType = ReturnType<typeof undoEvent>

export type evaluateEventsType = ReturnType<typeof evaluateEvents>

export type clearNotificationType = ReturnType<typeof clearNotification>

export type addTeamErrorType = ReturnType<typeof addTeamError>
