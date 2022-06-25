import { createAction } from '@reduxjs/toolkit'
import { Actor, EventType, Team } from '../../components/types'

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum MatchActionTypes {
  ADD_HOME_TEAM = 'ADD_HOME_TEAM',
  ADD_AWAY_TEAM = 'ADD_AWAY_TEAM',

  POINT_SCORED = 'POINT_SCORED',
  ADD_POINT = 'ADD_POINT',
  USE_TIMEOUT = 'USE_TIMEOUT',

  EVALUATE_SCORES = 'EVALUATE_SCORES',

  ADD_TEAM_ERROR = 'ADD_TEAM_ERROR',
}

export const addHomeTeam = createAction<Team>(MatchActionTypes.ADD_HOME_TEAM)
export const addAwayTeam = createAction<Team>(MatchActionTypes.ADD_AWAY_TEAM)

export const scorePoint = createAction<Actor>(MatchActionTypes.POINT_SCORED)
export const addPoint = createAction<Actor>(MatchActionTypes.ADD_POINT)
export const useTimeout = createAction<Actor>(MatchActionTypes.USE_TIMEOUT)

export const evaluateScores = createAction<Actor>(MatchActionTypes.EVALUATE_SCORES)

export const addTeamError = createAction<Error>(MatchActionTypes.ADD_TEAM_ERROR)

export type addHomeTeamType = ReturnType<typeof addHomeTeam>
export type addAwayTeamType =  ReturnType<typeof addAwayTeam>

export type scorePointType =  ReturnType<typeof scorePoint>
export type addPointType =  ReturnType<typeof addPoint>
export type useTimeoutType =  ReturnType<typeof useTimeout>

export type evaluateScoresType =  ReturnType<typeof evaluateScores>

export type addTeamErrorType = ReturnType<typeof addTeamError>
