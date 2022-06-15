
export type Team = {
    player1Name: string
    player2Name: string
    shirtColor: string
    added: boolean
  }

  export type Event = {
    eventType: string
    actor: string
    timestamp: Date
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
