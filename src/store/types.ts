import { Team } from "../components/types";

export type teamState = {
  homeTeam: Team,
  awayTeam: Team,
  shouldUpdate: boolean,
  errorMessage: Error|null,
}
