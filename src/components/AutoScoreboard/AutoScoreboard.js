import React, {useState, useRef, useEffect,useCallback} from 'react';
import {matchesFromTournament} from "../../firebase";
import {getUID} from "../../util/auth";
import {getScheduleBySlug} from "../../profixio";
import {getCurrentMatchId} from "./utils";
import ScoreBoard from "./ScoreBoard";
import NextGames from "./NextGames";
import {update} from "../../domain/tide/storage";


export default ({court, profixioSlug, tournamentId}) => {
  const [matches, setMatches] = useState([]);
  const [gameSchedule, setGameSchedule] = useState([]);
  const [currentMatchId, setCurrentMatchId] = useState(0)

  const updateMatches = useCallback( ({matches}) => {
      matches = Object.values(matches);
      setMatches(matches)
  });

  const loadMatches = async () => {
    // Hack to init firebase:
    const uid = await getUID()
    matchesFromTournament(tournamentId, updateMatches);
  }

  useEffect(() => {
    if (!matches || !gameSchedule) {
      return;
    }
    const match = getCurrentMatchId(matches, gameSchedule, court);

    if (match) {
      setCurrentMatchId(match.matchId);
    }
    else {
      setCurrentMatchId(0);
    }

  }, [matches, gameSchedule]);

  useEffect( () => {
    const updateGameSchedule = async () => {
      const schedule = await getScheduleBySlug(profixioSlug)
      console.log('Schedule', schedule);
      setGameSchedule(schedule);
    }

    const scheduleTimer = setInterval(updateGameSchedule, 1000*(60*3))

    updateGameSchedule();
    loadMatches();

    return () => {
      clearInterval(scheduleTimer);
    }

  }, [])

  if (!currentMatchId && gameSchedule) {
    return <NextGames schedule={gameSchedule} court={court} matches={matches} />
  }

  if (!currentMatchId) {
    return <div>No match found</div>
  }

  const match = matches.find(m => m.matchId == currentMatchId);

  console.log('Current match', match)
  return <ScoreBoard match={match} />
}
