import React, {useState, useRef, useEffect,useCallback} from 'react';
import {matchesFromTournament} from "../../firebase";
import {getUID} from "../../util/auth";
import {getScheduleBySlug} from "../../profixio";
import {getCurrentMatchId} from "./utils";
import ScoreBoard from "./ScoreBoard";
import NextGames from "./NextGames";
import {update} from "../../domain/tide/storage";
import Timeout from "./Timeout";
import {CSSTransition} from "react-transition-group";
import useProfixioMatches from "../../hooks/useProfixioMatches";
import {useInterval} from "../../hooks/useInterval";


export default ({court, profixioSlug, tournamentId, scoreDelay}) => {
  const [matches, setMatches] = useState([]);
  const gameSchedule = useProfixioMatches(profixioSlug);
  const [currentMatchId, setCurrentMatchId] = useState(0);
  const [homeTeamTimeoutTaken, setHomeTeamTimeoutTaken] = useState(false);
  const [awayTeamTimeoutTaken, setAwayTeamTimeoutTaken] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState('');
  const [match, setMatch] = useState(null);

  const updateMatches = useCallback( ({matches}) => {
    console.log('Update matches', matches);
    if (matches) {
      matches = Object.values(matches);
      setMatches(matches)
    }
  });

  const loadMatches = async () => {
    // Hack to init firebase:
    console.log('Loading matches');
    const uid = await getUID()
    console.log('Logged in with uid', uid, tournamentId)
    matchesFromTournament(tournamentId, updateMatches);
  }

  const updateCurrentMatch = useCallback(() => {
    if (!matches || !gameSchedule) {
      return;
    }
    console.log('Update current match', matches, gameSchedule, court);
    const m = getCurrentMatchId(matches, gameSchedule, court);

    if (m) {
      setCurrentMatchId(m.matchId);
    }
    else {
      setCurrentMatchId(0);
    }
  }, [matches, gameSchedule, court]);

  useEffect(() => {
    loadMatches();
  }, [])

  // updateCurrentMatch/getCurrentMatchId has some login related to next games,
  // which files if it's not ran by some external script...
  useInterval(() => {
    updateCurrentMatch()
  }, 10000);

  useEffect(() => {
    updateCurrentMatch()
  }, [matches, gameSchedule]);

  const handleMatchChange = () => {
    if (!currentMatchId || !matches) {
      return;
    }
    const m = matches.find(m => m.matchId == currentMatchId);
    setMatch(m);

    // If new set, reset timeouts:
    if (m.pointsInCurrentSet[0] == 0 && m.pointsInCurrentSet[1] == 0) {
      setHomeTeamTimeoutTaken(false);
      setAwayTeamTimeoutTaken(false)

    }
    if (!homeTeamTimeoutTaken && m.homeTeamTimeoutTaken) {
      setHomeTeamTimeoutTaken(true);
      setCurrentTimeout(`${m.h1Player} / ${m.h2Player}`);
      setTimeout(() => {
        setCurrentTimeout(null)
      }, 15000);
    }
    if (!awayTeamTimeoutTaken && m.awayTeamTimeoutTaken) {
      setAwayTeamTimeoutTaken(true);
      setCurrentTimeout(`${m.b1Player} / ${m.b2Player}`);
      setTimeout(() => {
        setCurrentTimeout(null)
      }, 15000);
    }
  }

  useEffect ( () => {
    if (scoreDelay) {
      setTimeout(() => {
        handleMatchChange();
      }, scoreDelay);
    }
    else {
      handleMatchChange();
    }
  }, [currentMatchId, matches])


  console.log('Current match', match, gameSchedule)
  return <div style={{width: '1920px',height: '1080px',position: 'relative'}}>

    <CSSTransition in={!!(currentMatchId && gameSchedule && match)}
                   timeout={1000}
                   classNames="scoreboard"
                   unmountOnExit>
      <ScoreBoard match={match} />
    </CSSTransition>

    <CSSTransition in={!!(!currentMatchId && gameSchedule)} timeout={1000}
                   classNames="next-games"
                   unmountOnExit
    >
      <NextGames schedule={gameSchedule} court={court} matches={matches} />
    </CSSTransition>

    <CSSTransition timeout={1000} in={!!currentTimeout}
                   classNames="timeout" unmountOnExit>
      <Timeout team={currentTimeout} />
    </CSSTransition>

  </div>
}


