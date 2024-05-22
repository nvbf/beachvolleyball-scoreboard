import { AdminMatch } from "../components/tournamentAdmin/types";
import { Team, Event, Set, Match, TeamType } from "../components/types";

export type matchState = {
  homeTeam: Team,
  awayTeam: Team,
  teamColor: { [key: string]: string },
  id: string,
  matchId: string,
  tournamentId: string,
  finished: boolean,
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
  errorMessage: string,
}

export type adminState = {
  matches: { [key: number]: AdminMatch },
  lastUpdated: number,
  dates: string[],
  fields: string[],
  id: string,
  secret: string,
  selectedDay: string,
  selectedCourt: string,
  errorMessage: string,
}
