import { v4 } from 'uuid';

export type Team = {
  player1Name: string
  player2Name: string
}

export type Set = {
  homeTeamScore: number,
  awayTeamScore: number
}

export type Match = {
  homeTeam: Team,
  awayTeam: Team,
  matchId: string,
  matchName: string,
  tournementId: string,
  timestamp: number,
  sets: Set[]
}

export type Event = {
  id: string
  timestamp: number
  eventType: EventType
  team: TeamType
  playerId: number
  undone: string
  author: string
  reference: string
}

export enum EventType {
  Score = "SCORE",
  Timeout = "TIMEOUT",
  Undo = "UNDO",
  FirstPlayerServer = "FIRST_PLAYER_SERVE",
  FirstTeamServer = "FIRST_TEAM_SERVE",
  ConfigureTeam = "TEAM_CONFIG",
  NoSideSwitch = "NO_SIDE_SWITCH",
  LeftSideStartTeam = "LEFT_SIDE_START_TEAM",
  PickColor = "TEAM_COLOR"
}

export enum TeamType {
  Home = "HOME",
  Away = "AWAY",
  None = "NONE",
}

export enum MatchOutcome {
  HomeWon = "HOME_WON",
  AwayWon = "AWAY_WON",
  NotStarted = "NOT_STARTED",
  Live = "LIVE",
}

export enum NotificationType {
  TeamTimeout = "TEAM_TIMEOUT",
  TechnicalTimeout = "TECHNICAL_TIMEOUT",
  SwitchSides = "SWITCH_SIDES",
  SetFinished = "SET_FINISHED",
  MatchFinished = "MATCH_FINISHED",
  Nothing = "NOTHING",
}
