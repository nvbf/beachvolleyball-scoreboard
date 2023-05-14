import React from 'react';
import AddAwayTeam from '../components/addAwayTeam';
import AddHomeTeam from '../components/addHomeTeam';
import { Notification } from '../components/notification';
import Scoreboard from '../components/scoreboard';
import { useAppSelector } from '../store/store';
import ScoreboardHeader from '../components/scoreboard/header';
import { matchState } from '../store/types';
import { EventType, TeamType, Event } from '../components/types';
import { ServeOrder } from '../components/serveOrder';
import { TeamColorPicker } from '../components/scoreboard/teamColorPicker';

function Match() {

  const homeTeam = useAppSelector(state => state.match.homeTeam)
  const awayTeam = useAppSelector(state => state.match.awayTeam)
  const match = useAppSelector(state => state.match)

  return (
    <main>
      <ScoreboardHeader />
      {getActiveDisplay(match) == DisplayType.AddHomeTeam && <AddHomeTeam />}
      {getActiveDisplay(match) == DisplayType.AddAwayTeam && <AddAwayTeam />}
      {getActiveDisplay(match) == DisplayType.PickHomeColor && <TeamColorPicker team={TeamType.Home} />}
      {getActiveDisplay(match) == DisplayType.PickAwayColor && <TeamColorPicker team={TeamType.Away} />}
      {getActiveDisplay(match) == DisplayType.SelectServeorder && <ServeOrder />}
      {getActiveDisplay(match) == DisplayType.ScoreBoard && <Scoreboard />}
      {match.showNotification && <Notification />}
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
  } else if (!serveOrderSet(state.events)) {
    return DisplayType.SelectServeorder
  }
  return DisplayType.ScoreBoard
}

function hasTeamPickedColor(events: Event[], team: TeamType): boolean {
  return events.some((event) => event.eventType === EventType.PickColor && event.team === team && !event.undone)
}

function serveOrderSet(events: Event[]): boolean {
  const sets: { [key: string]: number } = { [TeamType.Home]: 0, [TeamType.Away]: 0 };
  let homeSetScore = [0, 0, 0];
  let awaySetScore = [0, 0, 0];
  let currentSet = 1;
  let serveOrderSet = false
  let firstHomeServerSet = false
  let firstAwayServerSet = false

  events.forEach((event) => {
    if (event.undone) {
      return;
    }
    if (event.eventType === EventType.Score) {
      const setIndex = currentSet - 1;
      if (event.team === TeamType.Home) {
        homeSetScore[setIndex] += 1;
      } else {
        awaySetScore[setIndex] += 1;
      }
      if (currentSet === 1 || currentSet === 2) {
        if (homeSetScore[setIndex] >= 21 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          sets[TeamType.Home] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
          serveOrderSet = false;
          firstHomeServerSet = false;
          firstAwayServerSet = false;
        } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[TeamType.Away] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
          serveOrderSet = false;
          firstHomeServerSet = false;
          firstAwayServerSet = false;
        }
      } else {
        if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          sets[TeamType.Home] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          sets[TeamType.Away] += 1;
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        }
      }
    } else if (event.eventType === EventType.FirstPlayerServer) {
      if (event.team === TeamType.Home) {
        firstHomeServerSet = true
      } else {
        firstAwayServerSet = true
      }
    } else if (event.eventType === EventType.FirstTeamServer) {
      serveOrderSet = true
    }
  });
  return serveOrderSet && firstHomeServerSet && firstAwayServerSet;
}