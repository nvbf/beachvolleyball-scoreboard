import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Transition} from 'react-transition-group';
import {LAST_POINTS_LIST} from "../../domain/tide/state";
import LastPoints from "./LastPoints";
import LastSets from "./LastSets"; // ES6

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
    position: 'relative',
    "&.scoreboard-exit-active $divider": {
      animationDirection: 'reverse',
      animation: `$slideFromLeft 1s ease-in-out`
    },
    "&.scoreboard-enter-active $divider": {
      animation: `$slideFromLeft 1s ease-in-out`
    },
    "&.scoreboard-enter-active $teamRow": {
      animation: `$showBoard 1s ease-in-out`
    },
    "&.scoreboard-exit-active $teamRow": {
      animationDirection: 'reverse',
      animation: `$showBoard 1s ease-in-out`
    },
    "&.scoreboard-exit $teamRow": {
      opacity: 0
    },
    "&.scoreboard-exit $divider": {
      width: '2px'
    }
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
  },
  nameAndPointsContainerNoBorder: {
    borderBottom: 'none'
  },
  teamName: {
    textIndent: '10px',
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
  },
  servingTeamContainer: {
    width: '30px'
  },
  servingTeam: {
    width: '10px',
    height: '10px',
    margin: '10px',
    backgroundColor: '#222b38',
    borderRadius: '5px'
  },
  divider: {
    position: "absolute",
    top: '57px',
    left: '0px',
    backgroundColor: '#222b38',
    height: '2px',
    width: '471px'
  },
  "@keyframes showBoard": {
    "0%": {
      opacity: 0,
    },
    "66%": {
      opacity: 0,
    },
    "66.1%": {
      opacity: 1,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes slideFromLeft": {
    "0%": {
      top: "57px",
      width: "1px",
      height: "2px",
    },
    "33%": {
      width: "471px",
      height: "2px",
      top: "57px",
    },
    "66%": {
      width: "471px",
      height: "114px",
      top: "0px",
    },
    "100%": {
      height: "2px",
      width: "471px",
      top: "57px",
    }
  }
})

const calcFontSize = (match) => {
  let fontSize = '32px';
  const maxLength = Math.max(
    `${match.h1Player} / ${match.h2Player}`.length,
    `${match.b1Player} / ${match.b2Player}`.length,
  );

  if (maxLength > 15) {
    fontSize = '20px';
  }
  else if (maxLength > 12) {
    fontSize = '24';
  }
  return fontSize;
}

export default ({match, showLastPoints, showLastSetsPoints}) => {
  const classes = useStyles ();
  const [fontSize, setFontSize] = useState('32px');

  useEffect( () => {
    if (!match) {
      return;
    }
    setFontSize(calcFontSize(match));
  }, [match])

  const teamNameStyle = {
    fontSize
  }

  return <div className={classes.container}>
      <div className={classes.teamRows}>
        <div className={classes.teamRow}>
          <div className={classes.nameAndPointsContainer}>
            <div className={classes.servingTeamContainer}>
              {match.servingTeam == 'HOMETEAM' && <div className={classes.servingTeam}></div>}
            </div>
            <div className={classes.teamName} style={teamNameStyle}>{match.h1Player} / {match.h2Player}</div>
            <div className={classes.teamSets}>{match.setsWonByHomeTeam}</div>
            <LastPoints team='H' lastPointsList={match.lastPointsList} show={showLastPoints} />
            <LastSets team='H' match={match} show={showLastSetsPoints}/>
            <div className={classes.teamPoints}>{match.pointsInCurrentSet[0]}</div>
          </div>
        </div>
        <div className={classes.teamRow}>
          <div className={`${classes.nameAndPointsContainer} ${classes.nameAndPointsContainerNoBorder}`}>
            <div className={classes.servingTeamContainer}>
              {match.servingTeam == 'AWAYTEAM' &&
              <div className={classes.servingTeam}></div>
              }
            </div>
            <div className={classes.teamName} style={teamNameStyle}>{match.b1Player} / {match.b2Player}</div>
            <div className={classes.teamSets}>{match.setsWonByAwayTeam}</div>
            <LastPoints team='A' lastPointsList={match.lastPointsList} show={showLastPoints}/>
            <LastSets team='A' match={match} show={showLastSetsPoints}/>
            <div className={classes.teamPoints}>{match.pointsInCurrentSet[1]}</div>
          </div>
        </div>
      </div>
      <div className={classes.divider}/>
    </div>
}
