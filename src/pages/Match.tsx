import React from 'react';
import AddAwayTeam from '../components/addAwayTeam';
import AddHomeTeam from '../components/addHomeTeam';
import Scoreboard from '../components/scoreboard';
import { useAppSelector } from '../store/store';
import ScoreboardHeader from '../components/scoreboard/header';
import { matchState } from '../store/types';
import { EventType, TeamType, Event } from '../components/types';
import { ServeOrder } from '../components/serveOrder';
import { TeamColorPicker } from '../components/scoreboard/teamColorPicker';
import SwitchSides from '../components/scoreboard/switchSides';
import SetFinished from '../components/scoreboard/setFinished';
import MatchFinished from '../components/scoreboard/matchFinished';
import TeamTimeout from '../components/scoreboard/teamTimeout';
import TechnicalTimeout from '../components/scoreboard/technicalTimeout';

function Match() {

  const homeTeam = useAppSelector(state => state.match.homeTeam)
  const awayTeam = useAppSelector(state => state.match.awayTeam)
  const match = useAppSelector(state => state.match)

  return (
    <main>
      <ScoreboardHeader />
      {getActiveDisplay(match) === DisplayType.AddHomeTeam && <AddHomeTeam />}
      {getActiveDisplay(match) === DisplayType.AddAwayTeam && <AddAwayTeam />}
      {getActiveDisplay(match) === DisplayType.PickHomeColor && <TeamColorPicker team={TeamType.Home} />}
      {getActiveDisplay(match) === DisplayType.PickAwayColor && <TeamColorPicker team={TeamType.Away} />}
      {getActiveDisplay(match) === DisplayType.SelectServeorder && <ServeOrder />}
      {getActiveDisplay(match) === DisplayType.ScoreBoard && <Scoreboard />}
      {getActiveDisplay(match) === DisplayType.TeamTimeout && <TeamTimeout team={match.events[-1].team} />}
      {getActiveDisplay(match) === DisplayType.TechnicalTimeout && <TechnicalTimeout />}
      {getActiveDisplay(match) === DisplayType.SwitchSides && <SwitchSides />}
      {getActiveDisplay(match) === DisplayType.SetFinished && <SetFinished />}
      {getActiveDisplay(match) === DisplayType.MatchFinished && <MatchFinished />}
    </main>
  );
}

export default Match;

export enum DisplayType {
  ScoreBoard,
  SideSwitch,
  TeamTimeout,
  TechnicalTimeout,
  SelectServeorder,
  AddHomeTeam,
  AddAwayTeam,
  PickHomeColor,
  PickAwayColor,
  SwitchSides,
  SetFinished,
  MatchFinished
}

function getActiveDisplay(state: matchState): DisplayType {
  if (!state.homeTeam.added) {
    return DisplayType.AddHomeTeam
  } else if (!state.awayTeam.added) {
    return DisplayType.AddAwayTeam
  } else if (!hasTeamPickedColor(state.events, TeamType.Home)) {
    return DisplayType.PickHomeColor
  } else if (!hasTeamPickedColor(state.events, TeamType.Away)) {
    return DisplayType.PickAwayColor
  } else if (technicalTimeout(state) && state.showNotification) {
    return DisplayType.TechnicalTimeout
  } else if (teamTimeout(state) && state.showNotification) {
    return DisplayType.TeamTimeout
  } else if (setFinished(state) && state.showNotification) {
    return DisplayType.SetFinished
  } else if (matchFinished(state) && state.showNotification) {
    return DisplayType.MatchFinished
  } else if (switchSides(state) && state.showNotification) {
    return DisplayType.SwitchSides
  } else if (serveOrderSet(state)) {
    return DisplayType.SelectServeorder
  }
  return DisplayType.ScoreBoard
}

function hasTeamPickedColor(events: Event[], team: TeamType): boolean {
  return events.some((event) => event.eventType === EventType.PickColor && event.team === team && !event.undone)
}

function serveOrderSet(state: matchState): boolean {
  if (state.finished) {
    return false
  }
  return state.firstServerTeam === TeamType.None || state.firstServer[TeamType.Home] === 0 || state.firstServer[TeamType.Away] === 0;
}

function switchSides(state: matchState): boolean {
  let scoreSum = state.currentScore[TeamType.Home] + state.currentScore[TeamType.Away]
  if (scoreSum === 0) {
    return false
  } else if (state.currentSet == 3) {
    return scoreSum % 5 === 0;
  } else if (state.currentScore[TeamType.Home] + state.currentScore[TeamType.Away] === 21) {
    return false
  } else {
    return scoreSum % 7 === 0;
  }
}

function technicalTimeout(state: matchState): boolean {
  if (state.currentSet !== 3) {
    return state.currentScore[TeamType.Home] + state.currentScore[TeamType.Away] === 21
  }
  return false
}

function teamTimeout(state: matchState): boolean {
  return (state.events.slice().reverse().find(e => !e.undone)?.eventType) === EventType.Timeout || false;
}

function setFinished(state: matchState): boolean {
  let homeScore = state.currentScore[TeamType.Home]
  let awayScore = state.currentScore[TeamType.Away]
  console.log("finished: " + state.finished)
  console.log("homeScore >= 21 && homeScore - awayScore >= 2: " + (homeScore >= 21 && homeScore - awayScore >= 2))
  console.log(homeScore + " >= 21 && " + homeScore + " -" + awayScore + ">= 2: " + (homeScore >= 21 && homeScore - awayScore >= 2))

  console.log("awayScore >= 21 && awayScore - homeScore >= 2: " + (awayScore >= 21 && awayScore - homeScore >= 2))
  return !state.finished && (
    state.currentScore[TeamType.Home] === 0 && state.currentScore[TeamType.Away] === 0 && state.currentSet !== 1
  );
}

function matchFinished(state: matchState): boolean {
  return state.finished;
}