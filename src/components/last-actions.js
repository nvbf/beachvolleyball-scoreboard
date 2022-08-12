import React, {useMemo, useState} from "react";
import {Alert} from "react-bootstrap";
import {getDetailsAsAnArray} from "../domain/tide/logic";
import printf from "printf";
import { Button } from "react-bootstrap";
import {Box} from "@material-ui/core";
import moment from "moment";
import {useInterval} from "../hooks/useInterval";
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles({
    list: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    undo: {
      color: 'red'
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
        <Action action={lastAction} />
        {showAll && lastDetails.map((action) => {
          return <Action key={action.timestamp + ' ' + action.textString + action.value}
                         action={action} />
        })}
      </ul>
    </Alert>
  </section>
}

const Action = ({action}) => {
  const classes = useStyles();
  console.log('The action', action);
  const {
    timestamp, isUndo, homeScore, awayScore, textString, value
  } = action;

  let time = getTimeAgo(timestamp);;

  return <li class={isUndo ? classes.undo : ''}>[{time}] {printf(
    `${isUndo ? 'UNDO' : ''} ${homeScore}-${awayScore}, ${textString}`,
    value)}</li>
}

const getTimeAgo = (timestamp) => {
  const now = moment();
  const actionTime = moment(timestamp);
  const duration = moment.duration(now.diff(actionTime));
  console.log('Diration in minutes', duration.asMinutes());
  if (duration.asMinutes() < 1) {
    return parseInt(duration.asSeconds()) + ' seconds ago';
  }

  return moment(timestamp).fromNow();
}

export default LastAction;
