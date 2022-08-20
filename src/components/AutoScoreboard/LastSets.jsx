import React, {useEffect, useMemo, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ScoreBoard from "./ScoreBoard";
import {CSSTransition} from "react-transition-group";

const useAnimationStyles = ({ width }) => {
  const classes = useMemo ( () => {

    const classes = makeStyles({
      lastSetsContainer: {
        width: 0,
        height: '45px',
        position: 'relative',
        "&.scoreboard-last-sets-enter-active": {
          animation: `$slideFromLeft 1s ease-in-out forwards`,
          animationDelay: '0s'
        },
        "&.scoreboard-last-sets-exit-active": {
          animationDirection: 'reverse',
          animation: `$slideFromLeft 1s ease-in-out forwards`,
          animationDelay: '1s',
          width: width + 'px'
        },
        "&.scoreboard-last-sets-enter-done": {
          width: width + 'px'
        },
        "&.scoreboard-last-sets-enter-active $lastSetsInnerContainer": {
          animation: `$showText 1s ease-in-out forwards`,
          animationDelay: '1s'
        },
        "&.scoreboard-last-sets-exit-active $lastSetsContainer": {
          animation: `$showText 1s ease-in-out`,
          animationDelay: '0',
          animationDirection: 'reverse'
        },
        "&.scoreboard-last-sets-enter-done $lastSetsInnerContainer": {
          opacity: 1
        },
      },
      lastSetsInnerContainer: {
        display: 'flex',
        position: "absolute",
        opacity: 0
      },
      points: {
        backgroundColor: '#222b380d',
        color: '#222b38',
        width: '45px',
        height: '45px',
        fontSize: '32px',
        textAlign: 'center',
        fontWeight: 400,
        lineHeight: '45px',
        marginRight: '5px',
        '&.$pointPillTeamPoint': {}
      },
      pointPillTeamPoint: {
        opacity: 1,
      },
      "&.scoreboard-last-sets-enter-active $teamRow": {
        animation: `$showBoard 1s ease-in-out`
      },
      "@keyframes slideFromLeft": {
        "0%": {
          width: "0"
        },
        "100%": {
          width: width + 'px'
        }
      },
      "@keyframes showText": {
        "0%": {
          opacity: 0,
        },
        "100%": {
          opacity: 1
        }
      }
    });
    return classes;
  }, [width]);
  return classes();
}


export default ({match, team, show}) => {

  return <CSSTransition in={show}
                        timeout={4000}
                        classNames="scoreboard-last-sets"
                        unmountOnExit>
    <LastSetsScore team={team} match={match} />
  </CSSTransition>
}

const LastSetsScore = ({match, team}) => {
  const [pillsWidth, setPillsWidth] = useState(0);
  const classes = useAnimationStyles({width: pillsWidth});
  const ref = useRef();


  useEffect(() => {
    setPillsWidth(ref.current.offsetWidth)
  }, [])

  return <div className={`${pillsWidth > 0 ? classes.lastSetsContainer : ''}`} >
    <div className={classes.lastSetsInnerContainer} ref={ref}>
      {match.scoreInCompletedSetAsArray.map((set, index) => {
        return <div className={classes.points} key={index}>{team == 'H' ? set[0] : set[1]}</div>
      })}
    </div>
  </div>
}
