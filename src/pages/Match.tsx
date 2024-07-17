import React, { useState } from 'react';
import Scoreboard from '../components/scoreboard';
import { useAppDispatch, useAppSelector } from '../store/store';
import ScoreboardHeader from '../components/scoreboard/header';
import { matchState } from '../store/types';
import { EventType, TeamType } from '../components/types';
import { ServeOrder } from '../components/serveOrder';
import { SetLeftStartTeam } from '../components/scoreboard/setLeftStartTeam';
import SetFinished from '../components/scoreboard/setFinished';
import MatchFinished from '../components/scoreboard/matchFinished';
import TeamTimeout from '../components/scoreboard/teamTimeout';
import TechnicalTimeout from '../components/scoreboard/technicalTimeout';
import { useLocation, useParams } from 'react-router-dom';
import { authorize, checkDb, resetTeamColor, setId } from '../store/match/reducer';
import SwitchSides from '../components/scoreboard/switchSides';
import Loader from '../components/loader';
import MatchButtons from '../components/scoreboard/matchButtons';
import MatchFinalized from '../components/scoreboard/matchFinalized';
import EventList from '../components/eventList';
import { getLastValidEvent } from '../components/eventFunctions';


function Match() {
  const location = useLocation();
  const match = useAppSelector(state => state.match)
  const dispatch = useAppDispatch();
  const [checkedDb, setCheckedDb] = useState(false);

  const params = useParams();

  dispatch(authorize());

  if (!match.id && params.matchId) {
    console.log('set match id : %s', params.matchId)
    dispatch(setId(params.matchId))
  }

  if (!checkedDb && match.id) {
    dispatch(checkDb(match.id))
    console.log('checking for id : %s', match.id)
    setCheckedDb(true)
  }

  return (
    <main>
      <ScoreboardHeader />

      {getActiveDisplay(match) === DisplayType.SelectServeorder && <ServeOrder />}
      {getActiveDisplay(match) === DisplayType.SetLeftStartTeam && <SetLeftStartTeam />}

      {getActiveDisplay(match) === DisplayType.ScoreBoard && <Scoreboard />}
      {getActiveDisplay(match) === DisplayType.ScoreBoard && <MatchButtons />}
      {getActiveDisplay(match) === DisplayType.ScoreBoard && <EventList />}


      {getActiveDisplay(match) === DisplayType.TeamTimeout && <Scoreboard />}
      {getActiveDisplay(match) === DisplayType.TeamTimeout && <TeamTimeout team={match.events.slice().reverse()[0].team} />}
      {getActiveDisplay(match) === DisplayType.TeamTimeout && <EventList />}


      {getActiveDisplay(match) === DisplayType.TechnicalTimeout && <Scoreboard />}
      {getActiveDisplay(match) === DisplayType.TechnicalTimeout && <TechnicalTimeout startTime={match.events.slice().reverse()[0].timestamp} />}
      {getActiveDisplay(match) === DisplayType.TechnicalTimeout && <EventList />}


      {getActiveDisplay(match) === DisplayType.SwitchSides && <Scoreboard />}
      {getActiveDisplay(match) === DisplayType.SwitchSides && <SwitchSides />}

      {getActiveDisplay(match) === DisplayType.SetFinished && <SetFinished />}
      {getActiveDisplay(match) === DisplayType.SetFinished && <EventList />}

      {getActiveDisplay(match) === DisplayType.MatchFinished && <MatchFinished />}
      {getActiveDisplay(match) === DisplayType.MatchFinished && <EventList />}


      {getActiveDisplay(match) === DisplayType.MatchFinalized && <MatchFinalized />}
      {getActiveDisplay(match) === DisplayType.MatchFinalized && <EventList />}

      {getActiveDisplay(match) === DisplayType.Loading && < Loader />}
    </main>
  );
}

export default Match;

export enum DisplayType {
  Loading,
  ScoreBoard,
  SideSwitch,
  TeamTimeout,
  TechnicalTimeout,
  SelectServeorder,
  SetLeftStartTeam,
  SwitchSides,
  SetFinished,
  MatchFinished,
  MatchFinalized,
}

function getActiveDisplay(state: matchState): DisplayType {
  if (matchFinalized(state)) {
    return DisplayType.MatchFinalized
  } else if (state.matchId === "null" || state.authUserId === "") {
    return DisplayType.Loading
  } else if (technicalTimeout(state) && getLastValidEvent(state.events)?.eventType !== EventType.ClearMessage) {
    return DisplayType.TechnicalTimeout
  } else if (teamTimeout(state)) {
    return DisplayType.TeamTimeout
  } else if (setFinished(state)) {
    return DisplayType.SetFinished
  } else if (matchFinished(state) &&
    getLastValidEvent(state.events)?.eventType !== EventType.MatchFinalized
  ) {
    return DisplayType.MatchFinished
  } else if (switchSides(state) && getLastValidEvent(state.events)?.eventType !== EventType.ClearMessage) {
    return DisplayType.SwitchSides
  } else if (serveOrderSet(state)) {
    return DisplayType.SelectServeorder
  } else if (setLeftServer(state)) {
    console.log("setLeftServer")
    return DisplayType.SetLeftStartTeam
  }
  return DisplayType.ScoreBoard
}

function serveOrderSet(state: matchState): boolean {
  if (state.finished) {
    return false
  }
  return state.firstServerTeam === TeamType.None || state.firstServer[TeamType.Home] === 0 || state.firstServer[TeamType.Away] === 0;
}

function setLeftServer(state: matchState): boolean {
  console.log("in setLeftServer")
  if (state.noMirrorSides) {
    console.log("state.noMirrorSides")
    return false
  }
  return state.leftSideTeam === TeamType.None;
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

function matchFinalized(state: matchState): boolean {
  return getLastValidEvent(state.events)?.eventType === EventType.MatchFinalized || false;
}

function teamTimeout(state: matchState): boolean {
  return getLastValidEvent(state.events)?.eventType === EventType.Timeout || false;
}

function setFinished(state: matchState): boolean {
  return getLastValidEvent(state.events)?.eventType === EventType.Score && !state.finished && (
    state.currentScore[TeamType.Home] === 0 && state.currentScore[TeamType.Away] === 0 && state.currentSet !== 1
  ) && canUndo(state);
}

function matchFinished(state: matchState): boolean {
  return state.finished;
}

function canUndo(state: matchState): boolean {
  if (state.events.filter(e => !e.undone).slice().reverse()[0].eventType === EventType.SetFinalized) {
    return false
  }
  return true
}