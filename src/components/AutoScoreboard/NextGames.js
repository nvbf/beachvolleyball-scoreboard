import React, {useEffect, useState} from 'react';
import {getNextGames} from "./utils";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  container: {
    width: '1000px',
    position: 'absolute',
    left: '460px',
    top: '100px',
    "&.next-games-enter-active": {
      animation: `$slideFromTop 1s ease-in-out`
    },
    "&.next-games-enter-active $gameRows": {
      animation: `$slideFromTop2 1s ease-in-out`
    },
    "&.next-games-exit-active": {
      top: '-1000px',
      animationDirection: "reverse",
      animation: `$slideFromTop 1s ease-in-out`
    },
    "&.next-games-exit-active $gameRows": {
      top: '-1000px',
      animationDirection: "reverse",
      animation: `$slideFromTop2 1s ease-in-out`
    },
  },
  heading: {
    backgroundColor: '#222b38',
    color: 'white',
    fontSize: '48px',
    display: 'flex',
    alignItems: 'center',
    height: '100px',
    textIndent: '20px',
    textTransform: 'uppercase'
  },
  gameRowsOuter: {
    position: 'absolute',
    left: 0,
    top: '100px',
    width: '100%',
    overflow: 'hidden',
    height: '1000px'
  },
  gameRows: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
  },
  gameRow: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    fontSize: '32px',
    '&:first-child $teamName': {
      borderTop: '2px solid white',
    }
  },
  gameTime: {
    backgroundColor: '#222b38',
    color: 'white',
    borderTop: '2px solid white',
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '57px',

  },
  teamName: {
    width: '450px',
    fontSize: '24px',
    borderTop: '2px solid #222b38',
    height: '57px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '40px',

  },
  "@keyframes slideFromTop": {
    "0%": {
      top: '-100px',
    },
    "20%": {
      top: '100px'
    },
    "100%": {
      top: '100px'
    }
  },
  "@keyframes slideFromTop2": {
    "0%": {
      top: '-800px',
    },
    "17%": {
      top: '-800px'
    },
    "60%": {
      top: '0px'
    },
    "100%": {
      top: '0px'
    }
  },
})




export default ({matches, schedule, court}) => {
  const classes = useStyles();
  useEffect( () => {

  }, [schedule]);
  console.log('Schedule', schedule);
  const upcomingGames = getNextGames (matches, schedule, court);
//  const upcomingGames = nextMatches

  if (upcomingGames.length == 0) {
    return null;
  }

  console.log('Upcoming games', upcomingGames);
  return <div className={classes.container}>
    <div className={classes.heading}>
      Neste kamper {court}
    </div>
    <div className={classes.gameRowsOuter}>
      <div className={classes.gameRows}>
        {upcomingGames.slice(0, 10).map((game) => {
          return <div className={classes.gameRow} key={game.matchId}>
            <div className={classes.gameTime}>{game.time}</div>
            <div className={classes.teamName}>{game.homeTeam}</div>
            <div className={classes.teamName}>{game.awayTeam}</div>
          </div>
        })}
      </div>
    </div>
  </div>
}
