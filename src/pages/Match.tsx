import React from 'react';
import AddAwayTeam from '../components/addAwayTeam';
import AddHomeTeam from '../components/addHomeTeam';
import { Notification } from '../components/notification';
import Scoreboard from '../components/scoreboard';
import { useAppSelector } from '../store/store';

function Match() {

  const homeTeam = useAppSelector(state => state.match.homeTeam)
  const awayTeam = useAppSelector(state => state.match.awayTeam)
  const match = useAppSelector(state => state.match)

  return (
    <main>
      {!homeTeam.added && <AddHomeTeam />}
      {(homeTeam.added && !awayTeam.added) && <AddAwayTeam />}
      {(homeTeam.added && awayTeam.added && !match.showNotification) && <Scoreboard />}
      {match.showNotification && <Notification />} 
    </main>
  );

}

export default Match;
