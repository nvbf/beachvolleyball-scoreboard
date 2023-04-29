import { Team, Event, Set, Match } from "../components/types";

export type matchState = {
  homeTeam: Team,
  awayTeam: Team,
  matchId: string,
  tournementId: number,
  finished: boolean,
  showNotification: boolean,
  technicalTimeout: boolean,
  teamTimeout: boolean,
  switchSide: boolean,
  events: Event[],
  shouldUpdate: boolean,
  errorMessage: Error|null,
}

export type matchesState = {
  matches: Match[],
  lastUpdated: number,
  errorMessage: Error|null,
}
