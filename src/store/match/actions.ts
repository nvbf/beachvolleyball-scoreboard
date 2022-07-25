import { createAction } from '@reduxjs/toolkit'
import { Actor, NotificationType, Stopwatch, Team } from '../../components/types'

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum MatchActionTypes {
  ADD_HOME_TEAM = 'ADD_HOME_TEAM',
  ADD_AWAY_TEAM = 'ADD_AWAY_TEAM',

  POINT_SCORED = 'POINT_SCORED',
  ADD_POINT = 'ADD_POINT',
  CALL_TIMEOUT = 'CALL_TIMEOUT',
  SWITCH_SIDES = 'SWITCH_SIDES',

  TECHNICAL_TIMEOUT = 'CALL_TIMEOUT',
  EVALUATE_SCORES = 'EVALUATE_SCORES',

  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION',

  ADD_TEAM_ERROR = 'ADD_TEAM_ERROR',

  INIT_STOPWATCH = 'INIT_STOPWATCH',
  START_STOPWATCH = 'START_STOPWATCH',
  SET_TICK = 'SET_TICK',
  TRIGGER_TICK = 'TRIGGER_TICK',
  CANCEL_STOPWATCH = 'CANCEL_STOPWATCH',

}

export const addHomeTeam = createAction<Team>(MatchActionTypes.ADD_HOME_TEAM)
export const addAwayTeam = createAction<Team>(MatchActionTypes.ADD_AWAY_TEAM)

export const scorePoint = createAction<Actor>(MatchActionTypes.POINT_SCORED)
export const addPoint = createAction<Actor>(MatchActionTypes.ADD_POINT)
export const callTimeout = createAction<Actor>(MatchActionTypes.CALL_TIMEOUT)

export const showNotification = createAction(MatchActionTypes.SHOW_NOTIFICATION)
export const clearNotification = createAction<NotificationType>(MatchActionTypes.CLEAR_NOTIFICATION)

export const evaluateScores = createAction<Actor>(MatchActionTypes.EVALUATE_SCORES)

export const initStopwatch = createAction(MatchActionTypes.INIT_STOPWATCH)
export const startStopwatch = createAction(MatchActionTypes.START_STOPWATCH)
export const setTick = createAction(MatchActionTypes.SET_TICK)
export const triggerTick = createAction(MatchActionTypes.TRIGGER_TICK)
export const cancelStopwatch = createAction(MatchActionTypes.CANCEL_STOPWATCH)

export const addTeamError = createAction<Error>(MatchActionTypes.ADD_TEAM_ERROR)

export type addHomeTeamType = ReturnType<typeof addHomeTeam>
export type addAwayTeamType =  ReturnType<typeof addAwayTeam>

export type scorePointType =  ReturnType<typeof scorePoint>
export type addPointType =  ReturnType<typeof addPoint>
export type callTimeoutType =  ReturnType<typeof callTimeout>

export type showNotificationType =  ReturnType<typeof showNotification>
export type clearNotificationType =  ReturnType<typeof clearNotification>

export type evaluateScoresType =  ReturnType<typeof evaluateScores>

export type initStopwatchType =  ReturnType<typeof initStopwatch>
export type startStopwatchType =  ReturnType<typeof startStopwatch>
export type setTickType =  ReturnType<typeof setTick>
export type triggerTickType =  ReturnType<typeof triggerTick>
export type cancelStopwatchType =  ReturnType<typeof cancelStopwatch>

export type addTeamErrorType = ReturnType<typeof addTeamError>
