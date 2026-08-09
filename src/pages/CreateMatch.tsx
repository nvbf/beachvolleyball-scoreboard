import React, { useState } from 'react';
import { AddTeam } from '../components/scoreboard/addTeam';
import { useAppDispatch, useAppSelector } from '../store/store';
import { matchState } from '../store/types';
import { EventType, TeamType, Event } from '../components/types';
import { TeamColorPicker } from '../components/scoreboard/teamColorPicker';
import { useLocation } from 'react-router-dom';
import { addAwayTeam, addHomeTeam, checkDb, setMatchId, setTournamentId } from '../store/match/reducer';
import InitMatch from '../components/scoreboard/initMatch';
import Settings from '../components/scoreboard/settings';


function Match() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const match = useAppSelector(state => state.match)
  const dispatch = useAppDispatch();

  const homePlayer1 = searchParams.get('name1');
  const homePlayer2 = searchParams.get('name2');
  const awayPlayer1 = searchParams.get('name3');
  const awayPlayer2 = searchParams.get('name4');
  const matchId = searchParams.get('matchId');
  const tournamentId = searchParams.get('tournamentId');

  if (match.matchId === "null" && matchId) {
    dispatch(setMatchId(matchId))
  }

  if (match.tournamentId === "null" && tournamentId) {
    dispatch(setTournamentId(tournamentId))
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
      {getActiveDisplay(match) === DisplayType.AddHomeTeam && <AddTeam teamType={TeamType.Home} />}
      {getActiveDisplay(match) === DisplayType.AddAwayTeam && <AddTeam teamType={TeamType.Away} />}
      {getActiveDisplay(match) === DisplayType.PickHomeColor && <TeamColorPicker team={TeamType.Home} />}
      {getActiveDisplay(match) === DisplayType.PickAwayColor && <TeamColorPicker team={TeamType.Away} />}
      {getActiveDisplay(match) === DisplayType.MatchProperty && <Settings />}
      {getActiveDisplay(match) === DisplayType.InitMatch && <InitMatch />}
    </main>
  );
}

export default Match;

export enum DisplayType {
  AddHomeTeam,
  AddAwayTeam,
  MatchProperty,
  InitMatch,
  PickHomeColor,
  PickAwayColor
}

function getActiveDisplay(state: matchState): DisplayType {
  if (state.homeTeam.player1Name === "" || state.homeTeam.player2Name === "") {
    return DisplayType.AddHomeTeam
  } else if (state.awayTeam.player1Name === "" || state.awayTeam.player2Name === "") {
    return DisplayType.AddAwayTeam
  } else if (state.teamColor[TeamType.Home] === "") {
    return DisplayType.PickHomeColor
  } else if (state.teamColor[TeamType.Away] === "") {
    return DisplayType.PickAwayColor
  } else if (state.matchId === "null" || state.tournamentId === "null") {
    return DisplayType.MatchProperty
  }
  return DisplayType.InitMatch
}
