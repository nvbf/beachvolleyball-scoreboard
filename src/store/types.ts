import { AdminMatch } from "../components/tournamentAdmin/types";
import { Team, Event, Set, Match, TeamType } from "../components/types";

export type matchState = {
  homeTeam: Team,
  awayTeam: Team,
  teamColor: { [key: string]: string },
  id: string,
  matchId: string,
  tournamentId: string,
  checkedDb: boolean,
  finished: boolean,
  showNotification: boolean,
  switchSide: boolean,
  leftSideTeam: string,
  noMirrorSides: boolean,
  matchStarted: boolean,
  technicalTimeout: boolean,
  technicalTimeoutStart: number,
  currentSet: number,
  startTime: number,
  userMessage: string,
  currentSetScore: { [key: string]: number },
  theCurrentSets: { [key: string]: number }[],
  currentScore: { [key: string]: number },
  teamTimeout: { [key: string]: boolean },
  firstServer: { [key: string]: number },
  firstServerTeam: string,
  events: Event[],
  shouldUpdate: boolean,
  errorMessage: Error | null,
}

export type matchesState = {
  matches: { [key: number]: AdminMatch },
  lastUpdated: number,
  errorMessage: Error | null,
}
