import React, { useState } from 'react';
import { AddTeam } from '../components/scoreboard/addTeam';
import Scoreboard from '../components/scoreboard';
import { useAppDispatch, useAppSelector } from '../store/store';
import ScoreboardHeader from '../components/scoreboard/header';
import { matchState } from '../store/types';
import { EventType, TeamType, Event } from '../components/types';
import { ServeOrder } from '../components/serveOrder';
import { TeamColorPicker } from '../components/scoreboard/teamColorPicker';
import { SetLeftStartTeam } from '../components/scoreboard/setLeftStartTeam';
import SetFinished from '../components/scoreboard/setFinished';
import MatchFinished from '../components/scoreboard/matchFinished';
import TeamTimeout from '../components/scoreboard/teamTimeout';
import TechnicalTimeout from '../components/scoreboard/technicalTimeout';
import { useLocation } from 'react-router-dom';
import { addAwayTeam, addHomeTeam, checkDb, setMatchId } from '../store/match/actions';
import SwitchSides from '../components/scoreboard/switchSides';


function Match() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const match = useAppSelector(state => state.match)
  const dispatch = useAppDispatch();
  const [checkedDb, setCheckedDb] = useState(false);


  const homePlayer1 = searchParams.get('name1');
  const homePlayer2 = searchParams.get('name2');
  const awayPlayer1 = searchParams.get('name3');
  const awayPlayer2 = searchParams.get('name4');
  const matchId = searchParams.get('matchid');
  const tournementId = searchParams.get('tournementid');
  console.log("Is this being run all the time??? " + matchId)

  if (!match.matchId && matchId) {
    dispatch(setMatchId(matchId))
    setCheckedDb(true)
  }

  if (!checkedDb && matchId) {
    dispatch(checkDb(matchId))
    setCheckedDb(true)
  }

  if (!match.homeTeam.player1Name && !match.homeTeam.player1Name && homePlayer1 && homePlayer2) {
    dispatch(addHomeTeam({
      player1Name: homePlayer1,
      player2Name: homePlayer2,
    }))
  }

  if (!match.awayTeam.player1Name && !match.awayTeam.player1Name && awayPlayer1 && awayPlayer2) {
    dispatch(addAwayTeam({
      player1Name: awayPlayer1,
      player2Name: awayPlayer2,
    }))
  }

  return (
    <main>
      <ScoreboardHeader />
      {getActiveDisplay(match) === DisplayType.AddHomeTeam && <AddTeam teamType={TeamType.Home} />}
      {getActiveDisplay(match) === DisplayType.AddAwayTeam && <AddTeam teamType={TeamType.Away} />}
      {getActiveDisplay(match) === DisplayType.PickHomeColor && <TeamColorPicker team={TeamType.Home} />}
      {getActiveDisplay(match) === DisplayType.PickAwayColor && <TeamColorPicker team={TeamType.Away} />}
      {getActiveDisplay(match) === DisplayType.SelectServeorder && <ServeOrder />}
      {getActiveDisplay(match) === DisplayType.SetLeftStartTeam && <SetLeftStartTeam />}
      {getActiveDisplay(match) === DisplayType.ScoreBoard && <Scoreboard />}
      {getActiveDisplay(match) === DisplayType.TeamTimeout && <TeamTimeout team={match.events.slice().reverse()[0].team} />}
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
  SetLeftStartTeam,
  AddHomeTeam,
  AddAwayTeam,
  PickHomeColor,
  PickAwayColor,
  SwitchSides,
  SetFinished,
  MatchFinished
}

function getActiveDisplay(state: matchState): DisplayType {
  if (state.homeTeam.player1Name === "" || state.homeTeam.player2Name === "") {
    return DisplayType.AddHomeTeam
  } else if (state.awayTeam.player1Name === "" || state.awayTeam.player2Name === "") {
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
  } else if (setLeftServer(state)) {
    console.log("setLeftServer")
    return DisplayType.SetLeftStartTeam
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

function setLeftServer(state: matchState): boolean {
  console.log("in setLeftServer")
  if (state.noMirrorSides) {
    console.log("state.noMirrorSides")
    return false
  }
  console.log(state.leftSideTeam === TeamType.None)
  console.log("state.leftSideTeam === TeamType.None:")
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

function teamTimeout(state: matchState): boolean {
  return (state.events.slice().reverse().find(e => !e.undone)?.eventType) === EventType.Timeout || false;
}

function setFinished(state: matchState): boolean {
  return !state.finished && (
    state.currentScore[TeamType.Home] === 0 && state.currentScore[TeamType.Away] === 0 && state.currentSet !== 1
  );
}

function matchFinished(state: matchState): boolean {
  return state.finished;
}