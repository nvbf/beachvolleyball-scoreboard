import { Team, Event, Set, Match } from "../components/types";
import { Stopwatch } from "ts-stopwatch";


export type matchState = {
  homeTeam: Team,
  awayTeam: Team,
  stopwatch: number,
  runStopwatch: boolean,
  matchId: string,
  tournementId: number,
  currentSet: number,
  homeTimeout: boolean,
  awayTimeout: boolean,
  finished: boolean,
  showNotification: boolean,
  technicalTimeout: boolean,
  teamTimeout: boolean,
  switchSide: boolean,
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
