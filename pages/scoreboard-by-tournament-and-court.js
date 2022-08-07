import React, {useState, useEffect} from 'react';
import AutoScoreboard from "../src/components/AutoScoreboard/AutoScoreboard";
import url from "url";
import { makeStyles } from '@material-ui/core/styles';
import Head from "next/head";

const useStyles = makeStyles({
  container: {

  }
})

export default () => {
  const [tournamentId, setTournamentId] = useState(0);
  const [court, setCourt] = useState(0);
  const [profixioSlug, setProfixioSlug] = useState('');
  // Score delay is used if we have IP cams with high latency:
  const [scoreDelay, setScoreDelay] = useState(0);

  const classes = useStyles ();
  useEffect(() => {
    const qs = url.parse(document.location.search, true).query;
    console.log('QS:', qs)
    if (qs.tournamentid) {
      setTournamentId(qs.tournamentid);
    }
    if (qs.court) {
      setCourt(qs.court);
    }
    if (qs.profixioslug) {
      setProfixioSlug(qs.profixioslug);
    }
    if (qs.scoreDelay) {
      setScoreDelay(parseInt(qs.scoreDelay));
    }
  }, []);

  if (!tournamentId || !court || !profixioSlug) {
    return <div>GET params tourmanetid, profixioslug and court is required</div>
  }

  return <div className={classes.container}>
    <style jsx global>{`
            body {
              width: 1920px;
              height: 1080px;
              overflow: hidden;
              margin: 0;
              padding: 0;
              font-family: 'Open Sans','Source Sans Pro',sans-serif;
            }
            `}
    </style>
    <AutoScoreboard
    tournamentId={tournamentId} court={court}
    profixioSlug={profixioSlug} scoreDelay={scoreDelay}
  />
  </div>
}
