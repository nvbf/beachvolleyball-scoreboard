import React, {useMemo, useState} from "react";
import {Alert, Button} from "react-bootstrap";
import {getDetailsAsAnArray} from "../domain/tide/logic";
import printf from "printf";
import {Box} from "@material-ui/core";
import moment from "moment";
import {useInterval} from "../hooks/useInterval";
import {makeStyles} from "@material-ui/core/styles";
import {wrap} from "tide";
import {AWAYTEAM_COLOR, HOMETEAM_COLOR, MATCH} from "../domain/tide/state";

const useStyles = makeStyles({
    list: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    undo: {
      color: 'red'
    },
  teamIcon: {
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    marginRight: '5px',
    display: 'inline-block',
    '&.home-team': {
      backgroundColor: props => props[HOMETEAM_COLOR]
    },
    '&.away-team': {
      backgroundColor: props => props[AWAYTEAM_COLOR]
    }
  }
});


const LastAction = ({actionHistory}) => {
  const [counter, setCounter] = useState(0);
  const classes = useStyles();
  const [showAll, setShowAll] = useState(false);
  // Make sure time flies:
  useInterval(() => {
    setCounter(counter => counter+1);
  }, 1000);

  const lastDetails = useMemo(() => {
    const details = getDetailsAsAnArray(actionHistory);
    console.log('Last action details', details);
    return details.reverse();
  }, [actionHistory]);


  const lastAction = useMemo(() => {
    return lastDetails.shift();
  }, [lastDetails]);

  return <section>
    <Alert bsStyle="info">
      <Box display='flex' width='100%' justifyContent='space-between'>
        <h4>Last action(s)</h4>
        <Button variant='contained' onClick={() => setShowAll(sa => !sa)}>{showAll ? 'Hide log' : 'Show log'}</Button>
      </Box>
      <ul className={classes.list}>
        <WrappedAction action={lastAction} counter={counter}/>
        {showAll && lastDetails.map((action) => {
          return <WrappedAction key={action.timestamp + ' ' + action.textString + action.value}
                         action={action} counter={counter}/>
        })}
      </ul>
    </Alert>
  </section>
}

const Action = ({action, ...props}) => {
  const classes = useStyles(props);
  console.log('The action', action);
  const {
    timestamp, isUndo, homeScore, awayScore, textString, value, team
  } = action;

  let time = getTimeAgo(timestamp);;

  let teamIcon = '-';
  if (team == 'H') {
    teamIcon = <div className={`${classes.teamIcon} home-team`} />
  }
  else if (team == 'A') {
    teamIcon = <div className={`${classes.teamIcon} away-team`} />
  }

  return <li class={isUndo ? classes.undo : ''}>[{time}] {teamIcon} {printf(
    `${isUndo ? 'UNDO' : ''} ${homeScore}-${awayScore}, ${textString}`,
    value)}</li>
}

// Add team colors. Adding counter as prop just to avoid cache:
const WrappedAction = wrap(Action, {
  [HOMETEAM_COLOR]: [MATCH, HOMETEAM_COLOR],
  [AWAYTEAM_COLOR]: [MATCH, AWAYTEAM_COLOR],
});

const getTimeAgo = (timestamp) => {
  const now = moment();
  const actionTime = moment(timestamp);
  let duration = Math.floor(now.diff(actionTime) / 1000);
  console.log('Duration', duration/1000);

  let durationString = "";
  if (duration > 3600) {
    durationString += Math.floor(duration / 3600) + "h";
    duration = duration % 3600;
  }
  if (duration > 60) {
    durationString += Math.floor(duration / 60) + "m";
    duration = duration % 60;
  }

  durationString += duration + 's';

  return durationString;
}

export default LastAction;
