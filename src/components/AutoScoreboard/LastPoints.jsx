import React, {useEffect, useMemo, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ScoreBoard from "./ScoreBoard";
import {CSSTransition} from "react-transition-group";

const useAnimationStyles = ({ width }) => {
  const classes = useMemo ( () => {

    const classes = makeStyles({
      pillsContainer: {
        width: 0,
        height: '35px',
        position: 'relative',
        "&.scoreboard-last-points-enter-active": {
          animation: `$slideFromLeft 1s ease-in-out forwards`,
          animationDelay: '0s'
        },
        "&.scoreboard-last-points-exit-active": {
          animationDirection: 'reverse',
          animation: `$slideFromLeft 1s ease-in-out forwards`,
          animationDelay: '1s',
          width: width + 'px'
        },
        "&.scoreboard-last-points-enter-done": {
          width: width + 'px'
        },
        "&.scoreboard-last-points-enter-active $pillsInnerContainer": {
          animation: `$showText 1s ease-in-out forwards`,
          animationDelay: '1s'
        },
        "&.scoreboard-last-points-exit-active $pillsInnerContainer": {
          animation: `$showText 1s ease-in-out`,
          animationDelay: '0',
          animationDirection: 'reverse'
        },
        "&.scoreboard-last-points-enter-done $pillsInnerContainer": {
          opacity: 1
        },
      },
      pillsInnerContainer: {
        display: 'flex',
        position: "absolute",
        opacity: 0
      },
      pointPill: {
        height: '35px',
        width: '5px',
        borderRadius: '5px',
        marginRight: '5px',
        backgroundColor: '#222b38',
        opacity: 0.3,
        '&.$pointPillTeamPoint': {}
      },
      pointPillTeamPoint: {
        opacity: 1,
      },
      "&.scoreboard-last-points-enter-active $teamRow": {
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


export default ({lastPointsList, team, show}) => {
  console.log('Show last points', show);
  return <CSSTransition in={show}
                        timeout={4000}
                        classNames="scoreboard-last-points"
                        unmountOnExit>
      <Pills team={team} lastPointsList={lastPointsList} />
  </CSSTransition>
}

const Pills = ({lastPointsList, team}) => {
  const [pillsWidth, setPillsWidth] = useState(0);
  const classes = useAnimationStyles({width: pillsWidth});
  const ref = useRef();


  useEffect(() => {
    setPillsWidth(ref.current.offsetWidth)
  }, [])

  return <div className={`${pillsWidth > 0 ? classes.pillsContainer : ''}`} >
    <div className={classes.pillsInnerContainer} ref={ref}>
    {lastPointsList.map((t, index) => {
      return <div key={index} className={`${classes.pointPill} ${t == team ? classes.pointPillTeamPoint : ''}`} />
    })}
    </div>
  </div>
}
