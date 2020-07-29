import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    boxSizing: 'content-box',
    marginTop: '16px',
    marginLeft: '16px',
    minWidth: '400px',
    height: '116px',
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    fontFamily: '"Source Sans Pro", sans-serif',
    overflow: 'hidden',
  },
  teamRows: {
    display: 'flex',
    flexDirection: 'column'
  },
  teamRow: {
    width: '100%',
    height: '57px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxSizing: 'content-box',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  nameAndPointsContainer: {
    height: '57px',
    fontFamily: "'Open Sans','Source Sans Pro',sans-serif",
    color: '#222b38',
    backgroundColor: 'white',
    overflow: 'hidden',
    lineHeight: '55px',
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: '400',
    borderBottom: '2px solid #222b38',
  },
  nameAndPointsContainerNoBorder: {
    borderBottom: 'none'
  },
  teamName: {
    textIndent: '16px',
    width: '300px',
    marginRight: '16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: '32px',
  },
  teamSets: {
    width: '45px',
    height: '45px',
    color: 'white',
    backgroundColor: '#222b38',
    lineHeight: '45px',
    textAlign: 'center',
    fontSize: '32px',
    marginRight: '16px',
    fontWeight: '400',
  },
  teamPoints: {
    width: '48px',
    height: '48px',
    lineHeight: '48px',
    textAlign: 'center',
    fontWeight: '700',
    marginRight: '8px',
    marginLeft: '8px',
  }
})

export default ({match}) => {
  const classes = useStyles ();

  return <div className={classes.container}>
    <div className={classes.teamRows}>
      <div className={classes.teamRow}>
        <div className={classes.nameAndPointsContainer}>
          <div className={classes.teamName}>{match.h1Player} / {match.h2Player}</div>
          <div className={classes.teamSets}>{match.setsWonByHomeTeam}</div>
          <div className={classes.teamPoints}>{match.pointsInCurrentSet[0]}</div>
        </div>
      </div>
      <div className={classes.teamRow}>
        <div className={`${classes.nameAndPointsContainer} ${classes.nameAndPointsContainerNoBorder}`}>
          <div className={classes.teamName}>{match.b1Player} / {match.b2Player}</div>
          <div className={classes.teamSets}>{match.setsWonByAwayTeam}</div>
          <div className={classes.teamPoints}>{match.pointsInCurrentSet[1]}</div>
        </div>
      </div>
    </div>
    <div>{match.matchState}</div>
  </div>
}
