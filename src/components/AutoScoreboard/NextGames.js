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
    textTransform: 'uppercase',
    marginBottom: '10px'
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
    fontSize: '32px',
    marginTop: '10px',
  },
  gameTime: {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
    backgroundColor: '#222b38',
    color: 'white',
    width: '140px',
    justifyContent: 'center',
  },
  teamName: {
    paddingTop: '10px',
    paddingBottom: '10px',
    width: '450px',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'flex-start',
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

  const getTeamName = (team) => {
    if (team.players?.length == 2) {
      return <React.Fragment>
                {team.players[0]}<br />
                {team.players[1]}
      </React.Fragment>
    }
    return <React.Fragment>{team.name}</React.Fragment>
  }

  console.log('Upcoming games', upcomingGames);
  return <div className={classes.container}>
    <div className={classes.heading}>
      Neste kamper {court}
    </div>
    <div className={classes.gameRowsOuter}>
      <div className={classes.gameRows}>
        {upcomingGames.slice(0, 8).map((game) => {
          return <div className={classes.gameRow} key={game.matchId}>
            <div className={classes.gameTime}>{game.time}</div>
            <div className={classes.teamName}>{getTeamName(game.homeTeam)}</div>
            <div className={classes.teamName}>{getTeamName(game.awayTeam)}</div>
          </div>
        })}
      </div>
    </div>
  </div>
}
