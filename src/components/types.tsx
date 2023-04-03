
export type Team = {
  player1Name: string
  player2Name: string
  shirtColor: string
  added: boolean
}

export type Event = {
  eventType: EventType
  actor: Actor
  timestamp: Date
  undone: boolean
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
  timestamp: Date,
  sets: Set[]
}

export enum EventType {
  Score = "SCORE",
  Timeout = "TIMEOUT",
  FirstPlayerServer = "FIRST_PLAYER_SERVE",
  FirstTeamServer = "FIRST_TEAM_SERVE",
  ConfigureTeam = "TEAM_CONFIG"
}

export enum Actor {
  HomePlayer1 = "HOME_1",
  HomePlayer2 = "HOME_2",
  AwayPlayer1 = "AWAY_1",
  AwayPlayer2 = "AWAY_2",
  HomeTeam = "HOME_TEAM",
  AwayTeam = "AWAY_TEAM",
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
