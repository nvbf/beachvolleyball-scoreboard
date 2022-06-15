import { Team, Event, Set, Match } from "../components/types";

export type matchState = {
  homeTeam: Team,
  awayTeam: Team,
  matchId: string,
  tournementId: number,
  events: Event[],
  sets: Set[],
  shouldUpdate: boolean,
  errorMessage: Error|null,
}

export type matchesState = {
  matches: Match[],
  lastUpdated: Date,
  errorMessage: Error|null,
}
