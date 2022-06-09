import React from 'react';
import { useAppSelector } from '../store/store';
import AddHomeTeam from '../components/addHomeTeam';
import AddAwayTeam from '../components/addAwayTeam';
import Scoreboard from '../components/scoreboard';

function Match() {

  const homeTeam = useAppSelector(state => state.team.homeTeam)
  const awayTeam = useAppSelector(state => state.team.awayTeam)

  return (
    <main>
      {!homeTeam.added && <AddHomeTeam />}
      {(homeTeam.added && !awayTeam.added) && <AddAwayTeam />}
      {(homeTeam.added && awayTeam.added) && <Scoreboard />}
    </main>
  );

}

export default Match;
