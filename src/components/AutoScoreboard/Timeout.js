import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    width: '600px',
    position: 'absolute',
    bottom: '50px',
    left: '510px',
    "&.timeout-enter-active": {
      animation: `$slideFromLeft 1s ease-in-out`
    },
    "&.timeout-enter-active $heading": {
      animation: `$expandCollapse 1s ease-in-out`
    },
    "&.timeout-enter-active $teamName": {
      animation: `$showTeamName 1s ease-in-out`
    },

    "&.timeout-exit-active": {
      animationDirection: 'reverse',
      left: '-300px',
      animation: `$slideFromLeft 1s ease-in-out`
    },
    "&.timeout-exit-active $heading": {
      animationDirection: 'reverse',
      animation: `$expandCollapse 1s ease-in-out`
    },
    "&.timeout-exit-active $teamName": {
      animationDirection: 'reverse',
      opacity: 0,
      animation: `$showTeamName 1s ease-in-out`
    },
  },
  heading: {
    color: 'white',
    backgroundColor: '#222b38',
    height: '57px',
    lineHeight: '57px',
    fontSize: '32px',
    textIndent: '16px',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1
  },
  teamName: {
    height: '57px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '28px',
    lineHeight: '57px',
    textIndent: '16px',
    marginTop: '57px',
  },
  "@keyframes slideFromLeft": {
    "0%": {
      left: '-300px',
    },
    "33%": {
      left: '510px'
    },
    "100%": {
      left: '510px'
    }
  },
  "@keyframes expandCollapse": {
    "33%": {
      height: '57px'
    },
    "66%": {
      height: '114px'
    },
    "100%": {
      height: '57px'
    },
  },
  "@keyframes showTeamName": {
    "0%": {
      opacity: 0
    },
    "66%": {
      opacity: 0
    },
    "66.1%": {
      opacity: 1
    },
    "100%": {
      opacity: 1
    }
  }
})

export default ({team}) => {
  const classes = useStyles();
  return <div className={`${classes.container} ${team && 'visible'}`} >
    <div className={classes.heading}>Timeout</div>
    <div className={classes.teamName}>{team}</div>
  </div>
}
