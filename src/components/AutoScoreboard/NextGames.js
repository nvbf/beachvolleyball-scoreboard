import React, {useEffect, useState} from 'react';
import {getNextGames} from "./utils";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  container: {
    width: '1000px',
    margin: '100px auto 100px auto'
  },
  heading: {
    backgroundColor: 'black',
    color: 'white',
    marginBottom: '20px',
    fontSize: '48px',
    display: 'flex',
    alignItems: 'center',
    height: '100px',
    textIndent: '20px',
    textTransform: 'uppercase'
  },
  gameRow: {
    backgroundColor: 'white',
    height: '57px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '32px',
  },
  gameTime: {
    width: '100px',
    padding: '8px'
  },
  teamName: {
    width: '450px',
    fontSize: '24px'
  }
})

export default ({matches, schedule, court}) => {
  const classes = useStyles();
  useEffect( () => {

  }, [schedule]);
  console.log('Schedule', schedule);
  const upcomingGames = getNextGames (matches, schedule, court);

  if (upcomingGames.length == 0) {
    return null;
  }

  console.log('Upcoming games', upcomingGames);
  return <div className={classes.container}>
    <div className={classes.heading}>
      Neste kamper {court}
    </div>
    {upcomingGames.slice(0, 10).map((game) => {
      return <div className={classes.gameRow} key={game.matchId}>
        <div className={classes.gameTime}>{game.time}</div>
        <div className={classes.teamName}>{game.homeTeam}</div>
        <div className={classes.teamName}>{game.awayTeam}</div>
      </div>
    })}
  </div>
}
