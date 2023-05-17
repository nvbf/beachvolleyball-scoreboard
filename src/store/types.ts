import { Team, Event, Set, Match, TeamType } from "../components/types";

export type matchState = {
  homeTeam: Team,
  awayTeam: Team,
  matchId: string,
  tournementId: number,
  finished: boolean,
  showNotification: boolean,
  switchSide: boolean,
  mirrorSides: boolean,
  currentSet: number,
  currentSetScore: {[key: string]: number},
  currentScore: { [key: string]: number },
  teamTimeout: { [key: string]: boolean },
  firstServer: { [key: string]: number },
  firstServerTeam: string,
  events: Event[],
  shouldUpdate: boolean,
  errorMessage: Error|null,
}

export type matchesState = {
  matches: Match[],
  lastUpdated: number,
  errorMessage: Error|null,
}
