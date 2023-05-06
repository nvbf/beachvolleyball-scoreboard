import React from 'react';
import AddAwayTeam from '../components/addAwayTeam';
import AddHomeTeam from '../components/addHomeTeam';
import { Notification } from '../components/notification';
import Scoreboard from '../components/scoreboard';
import { useAppSelector } from '../store/store';
import ScoreboardHeader from '../components/scoreboard/header';

function Match() {

  const homeTeam = useAppSelector(state => state.match.homeTeam)
  const awayTeam = useAppSelector(state => state.match.awayTeam)
  const match = useAppSelector(state => state.match)

  return (
    <main>
      <ScoreboardHeader />
      {!homeTeam.added && <AddHomeTeam />}
      {(homeTeam.added && !awayTeam.added) && <AddAwayTeam />}
      {(homeTeam.added === true && awayTeam.added && !match.showNotification) && <Scoreboard />}
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
}
