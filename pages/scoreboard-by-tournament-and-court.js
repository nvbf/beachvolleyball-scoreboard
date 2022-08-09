import React, {useState, useEffect} from 'react';
import AutoScoreboard from "../src/components/AutoScoreboard/AutoScoreboard";
import url from "url";
import { makeStyles } from '@material-ui/core/styles';
import Head from "next/head";
import {useRouter} from "next/router";
import {getUID} from "../src/util/auth";
import {getTournament} from "../src/firebase";

const useStyles = makeStyles({
  '@global': {
    body: {
      backgroundColor: 'transparent'
    }
  },
  container: {

  }
})

export default () => {
  const router = useRouter()
  // Score delay is used if we have IP cams with high latency:
  const [scoreDelay, setScoreDelay] = useState(0);
  const [tournamentId, setTournamentId] = useState(-1);
  const classes = useStyles ();

  const initScoreBoard = async () => {
    const uid = await getUID();
    console.log('Looking for tournament slug', router, router.query.slug);
    const tournament = await getTournament(router.query.slug);
    console.log('Tournament', tournament);
    setTournamentId(tournament.privateId);
  }

  useEffect(() => {
    const qs = url.parse(document.location.search, true).query;
    initScoreBoard()

    if (qs.scoreDelay) {
      setScoreDelay(parseInt(qs.scoreDelay));
    }
  }, []);

  if (tournamentId < 0) {
    return <div>Loading scoreboard</div>
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
              background-color: transparent;
            }
            `}
    </style>
    <AutoScoreboard
      tournamentId={tournamentId}
      court={router.query.court}
      profixioSlug={router.query.profixioSlug}
      scoreDelay={scoreDelay}
    />
  </div>
}


export async function getServerSideProps(context) {
  console.log('The context', context)
  return {
    props: {} //context.query, // will be passed to the page component as props
  }
}
