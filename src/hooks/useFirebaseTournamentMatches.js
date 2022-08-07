import {getScheduleBySlug} from "../profixio";
import {useEffect, useState} from "react";
import {getUID} from "../util/auth";
import {getTournament, matchesFromTournament} from "../firebase";


export default (slug) => {
  const [matches, setMatches] = useState([]);
  const [tournament, setTournament] = useState(null);
  const updateMatches = (matches) => {
    console.log('Matches', matches)
    setMatches(matches.matches);
  }

  const initTournament = async () => {
    // Make sure we're logged in:
    const uid = await getUID();
    const tournament = await getTournament(slug);
    setTournament(tournament);
    matchesFromTournament(tournament.privateId, updateMatches);
  }

  useEffect(() => {
    console.log('Fetching tournament matches');
    initTournament();
  }, []);

  return { matches, tournament};
}
