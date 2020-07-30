import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    width: '600px',
    position: 'absolute',
    marginLeft: '-300px',
    left: '50%',
    right: 0,
    display: 'none',
    bottom: '50px',
    '&.visible': {
      display: 'block'
    }
  },
  heading: {
    color: 'white',
    backgroundColor: 'black',
    marginBottom: '8px',
    height: '57px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '32px',
    textIndent: '16px'
  },
  teamName: {
    height: '57px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    textIndent: '16px'
  }
})

export default ({team}) => {
  const classes = useStyles();
  return <div className={`${classes.container} ${team && 'visible'}`} >
    <div className={classes.heading}>Timeout</div>
    <div className={classes.teamName}>{team}</div>
  </div>
}
