import { createAction } from '@reduxjs/toolkit'
import { Team } from '../../components/types'

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum TeamActionTypes {
  ADD_HOME_TEAM = 'ADD_HOME_TEAM',

  ADD_AWAY_TEAM = 'ADD_AWAY_TEAM',
  ADD_TEAM_ERROR = 'ADD_TEAM_ERROR',
}

export const addHomeTeam = createAction<Team>(TeamActionTypes.ADD_HOME_TEAM)

export const addAwayTeam = createAction<Team>(TeamActionTypes.ADD_AWAY_TEAM)
export const addTeamError = createAction<Error>(TeamActionTypes.ADD_TEAM_ERROR)

export type addHomeTeamType = ReturnType<typeof addHomeTeam>

export type addAwayTeamType =  ReturnType<typeof addAwayTeam>
export type addTeamErrorType = ReturnType<typeof addTeamError>
