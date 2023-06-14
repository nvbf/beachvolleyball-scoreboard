import { createAction } from '@reduxjs/toolkit'
import { TeamType, NotificationType, Team, Event, Match } from '../../components/types'

export interface AddEventPayload {
  matchId: string;
  id: string;
  event: Event;
}

export interface AddTeamColorPayload {
  team: TeamType;
  color: string;
}

// Use explicity string enums, otherwise the react-devtools struggle with identifying the action, as the
// action type then would be numbers
export enum MatchActionTypes {
  CHECK_DB = 'CHECK_DB',
  STORE_EVENTS = 'STORE_EVENTS',
  STORE_MATCH = 'STORE_MATCH',
  PUBLISH_SCORES = 'PUBLISH_SCORES',

  SET_MATCH_ID = 'SET_MATCH_ID',
  SET_TOURNEMENT_ID = 'SET_TOURNEMENT_ID',
  SET_ID = 'SET_ID',

  FINALIZE_SET = 'FINALIZE_SET',
  FINALIZE_MATCH = 'FINALIZE_MATCH',

  ADD_HOME_TEAM = 'ADD_HOME_TEAM',
  ADD_AWAY_TEAM = 'ADD_AWAY_TEAM',

  SET_TEAM_COLOR = 'SET_TEAM_COLOR',

  CALL_TIMEOUT = 'CALL_TIMEOUT',
  SWITCH_SIDES = 'SWITCH_SIDES',

  UPDATE_SCORES = 'UPDATE_SCORES',

  TECHNICAL_TIMEOUT = 'CALL_TIMEOUT',
  EVALUATE_EVENTS = 'EVALUATE_EVENTS',

  ADD_TEAM_ERROR = 'ADD_TEAM_ERROR',

  ADD_EVENT = 'ADD_EVENT',
  UNDO_LAST_EVENT = 'UNDO_LAST_EVENT',

  INSERT_EVENT = 'INSERT_EVENT',
  UNDO_EVENT = 'UNDO_EVENT',

  NO_MIRROR_SIDES = 'NO_MIRROR_SIDES',
  TEAM_START_LEFT = 'TEAM_START_LEFT',

  RESET_MATCH_ID = 'RESET_MATCH_ID',
  RESET_TOURNEMENT_ID = 'RESET_TOURNEMENT_ID',
  RESET_TEAM_COLOR = 'RESET_TEAM_COLOR',
  RESET_HOME_PLAYER_NAME = 'RESET_HOME_PLAYER_NAME',
  RESET_AWAY_PLAYER_NAME = 'RESET_AWAY_PLAYER_NAME',
  INIT_MATCH = 'INIT_MATCH',
}

export const checkDb = createAction<string>(MatchActionTypes.CHECK_DB)
export const storeEvents = createAction<Event[]>(MatchActionTypes.STORE_EVENTS)
export const storeMatch = createAction<Match>(MatchActionTypes.STORE_MATCH)
export const publishScores = createAction(MatchActionTypes.PUBLISH_SCORES)

export const setMatchId = createAction<string>(MatchActionTypes.SET_MATCH_ID)
export const setTournamentId = createAction<string>(MatchActionTypes.SET_TOURNEMENT_ID)
export const setId = createAction<string>(MatchActionTypes.SET_ID)

export const finalizeMatch = createAction(MatchActionTypes.FINALIZE_MATCH)
export const finalizeSet = createAction(MatchActionTypes.FINALIZE_SET)

export const addHomeTeam = createAction<Team>(MatchActionTypes.ADD_HOME_TEAM)
export const addAwayTeam = createAction<Team>(MatchActionTypes.ADD_AWAY_TEAM)

export const setTeamColor = createAction<AddTeamColorPayload>(MatchActionTypes.SET_TEAM_COLOR)

export const updateScores = createAction<TeamType>(MatchActionTypes.UPDATE_SCORES)

export const addTeamError = createAction<Error>(MatchActionTypes.ADD_TEAM_ERROR)

export const addEvent = createAction<AddEventPayload>(MatchActionTypes.ADD_EVENT)
export const undoEvent = createAction<AddEventPayload>(MatchActionTypes.UNDO_EVENT)

export const insertEvent = createAction<Event>(MatchActionTypes.INSERT_EVENT)
export const undoLastEvent = createAction(MatchActionTypes.UNDO_LAST_EVENT)

export const noMirrorSides = createAction(MatchActionTypes.NO_MIRROR_SIDES)
export const teamStartLeft = createAction<TeamType>(MatchActionTypes.TEAM_START_LEFT)

export const evaluateEvents = createAction(MatchActionTypes.EVALUATE_EVENTS)

export const resetMatchId = createAction(MatchActionTypes.RESET_MATCH_ID)
export const resetTournamentId = createAction(MatchActionTypes.RESET_TOURNEMENT_ID)
export const resetTeamColor = createAction<TeamType>(MatchActionTypes.RESET_TEAM_COLOR)
export const resetHomePlayerName = createAction<number>(MatchActionTypes.RESET_HOME_PLAYER_NAME)
export const resetAwayPlayerName = createAction<number>(MatchActionTypes.RESET_AWAY_PLAYER_NAME)
export const initMatch = createAction<Match>(MatchActionTypes.INIT_MATCH)


export type checkDbType = ReturnType<typeof checkDb>
export type storeEventsType = ReturnType<typeof storeEvents>
export type storeMatchType = ReturnType<typeof storeMatch>
export type publishScoresType = ReturnType<typeof publishScores>

export type setMatchIdType = ReturnType<typeof setMatchId>
export type setTournamentIdType = ReturnType<typeof setTournamentId>
export type setIdType = ReturnType<typeof setId>

export type finalizeMatchType = ReturnType<typeof finalizeMatch>
export type finalizeSetType = ReturnType<typeof finalizeSet>

export type addHomeTeamType = ReturnType<typeof addHomeTeam>
export type addAwayTeamType = ReturnType<typeof addAwayTeam>

export type setTeamColorType = ReturnType<typeof setTeamColor>

export type addEventType = ReturnType<typeof addEvent>
export type undoEventType = ReturnType<typeof undoEvent>

export type insertEventType = ReturnType<typeof insertEvent>
export type undoLastEventType = ReturnType<typeof undoLastEvent>

export type noMirrorSidesType = ReturnType<typeof noMirrorSides>
export type teamStartLeftType = ReturnType<typeof teamStartLeft>

export type evaluateEventsType = ReturnType<typeof evaluateEvents>

export type addTeamErrorType = ReturnType<typeof addTeamError>

export type resetMatchIdType = ReturnType<typeof resetMatchId>
export type resetTournamentIdType = ReturnType<typeof resetTournamentId>
export type resetTeamColorType = ReturnType<typeof resetTeamColor>
export type resetHomePlayerNameType = ReturnType<typeof resetHomePlayerName>
export type resetAwayPlayerNameType = ReturnType<typeof resetAwayPlayerName>
export type initMatchType = ReturnType<typeof initMatch>
