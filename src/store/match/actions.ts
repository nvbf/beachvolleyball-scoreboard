import { createAction } from '@reduxjs/toolkit'
import { TeamType, NotificationType, Team } from '../../components/types'

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum MatchActionTypes {
  ADD_HOME_TEAM = 'ADD_HOME_TEAM',
  ADD_AWAY_TEAM = 'ADD_AWAY_TEAM',

  POINT_SCORED = 'POINT_SCORED',
  ADD_POINT = 'ADD_POINT',
  CALL_TIMEOUT = 'CALL_TIMEOUT',
  SWITCH_SIDES = 'SWITCH_SIDES',

  UPDATE_SCORES = 'UPDATE_SCORES',

  UNDO_LAST_EVENT = 'UNDO_LAST_EVENT',

  TECHNICAL_TIMEOUT = 'CALL_TIMEOUT',
  EVALUATE_SCORES = 'EVALUATE_SCORES',

  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION',

  ADD_TEAM_ERROR = 'ADD_TEAM_ERROR',
}

export const addHomeTeam = createAction<Team>(MatchActionTypes.ADD_HOME_TEAM)
export const addAwayTeam = createAction<Team>(MatchActionTypes.ADD_AWAY_TEAM)

export const scorePoint = createAction<TeamType>(MatchActionTypes.POINT_SCORED)
export const addPoint = createAction<TeamType>(MatchActionTypes.ADD_POINT)
export const callTimeout = createAction<TeamType>(MatchActionTypes.CALL_TIMEOUT)

export const updateScores = createAction<TeamType>(MatchActionTypes.UPDATE_SCORES)

export const undoLastEvent = createAction(MatchActionTypes.UNDO_LAST_EVENT)

export const showNotification = createAction(MatchActionTypes.SHOW_NOTIFICATION)
export const clearNotification = createAction<NotificationType>(MatchActionTypes.CLEAR_NOTIFICATION)

export const evaluateScores = createAction<TeamType>(MatchActionTypes.EVALUATE_SCORES)

export const addTeamError = createAction<Error>(MatchActionTypes.ADD_TEAM_ERROR)

export type addHomeTeamType = ReturnType<typeof addHomeTeam>
export type addAwayTeamType =  ReturnType<typeof addAwayTeam>

export type scorePointType =  ReturnType<typeof scorePoint>
export type addPointType =  ReturnType<typeof addPoint>
export type callTimeoutType =  ReturnType<typeof callTimeout>

export type undoLastEventType = ReturnType<typeof undoLastEvent>

export type showNotificationType =  ReturnType<typeof showNotification>
export type clearNotificationType =  ReturnType<typeof clearNotification>

export type evaluateScoresType =  ReturnType<typeof evaluateScores>

export type addTeamErrorType = ReturnType<typeof addTeamError>
