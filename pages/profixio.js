import AppBarMain from "../src/components/components/appbar";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import IconButton from "@material-ui/core/IconButton";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Icon from "@material-ui/core/Icon";
import React, {useEffect, useState} from "react";
import useProfixioMatches from "../src/hooks/useProfixioMatches";
import useFirebaseTournamentMatches from "../src/hooks/useFirebaseTournamentMatches";
import {useRouter} from 'next/router'
import QRCodeIcon from '@material-ui/icons/Edit'
import QRCode from "react-qr-code";
import Link from "next/Link";
import tournament from "./tournament";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  matchComplete: {
    textDecoration: 'line-through',
    opacity: 0.5
  },
  liveHeading: {
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center'
  },
  liveSets: {
    fontSize: '1.3rem',
    textAlign: 'center'
  },
  livePoints: {
    textAlign: 'center'
  }
})

export default (props) => {
  const router = useRouter();
  const [currentMatch, setCurrentMatch] = useState(null);
  console.log('Router', router)

  const profixioMatches = useProfixioMatches(router.query.profixioSlug);
  const {matches: firebaseMatches, tournament} = useFirebaseTournamentMatches(router.query.slug);
  const [matchTimes, setMatchTimes] = useState([]);
  useEffect(() => {
    console.log('Matches or something changed', firebaseMatches);
    setMatchTimes(profixioMatches
      .sort((a, b) => (a.epoch - b.epoch) || (a.court.localeCompare(b.court)))
      .reduce ((allTimes, match) => {
        let lastTime = allTimes[allTimes.length-1];
        if (!lastTime || match.epoch != lastTime.epoch) {
          allTimes.push({
            epoch: match.epoch,
            matches: []
          });
          lastTime = allTimes[allTimes.length-1];
        }
        const newMatch = {...match};
        newMatch.firebaseMatch = firebaseMatches && firebaseMatches[newMatch.matchId]
        if (!newMatch.isFinished) {
          newMatch.isFinished = newMatch.firebaseMatch?.isFinished;
        }
        lastTime.matches.push(newMatch);
        return allTimes;
      }, [])
    );
  }, [firebaseMatches, profixioMatches])

  useEffect(() => {
    const firstMatchNotStarted = document.querySelector('.match-not-started');
    if (firstMatchNotStarted) {
      firstMatchNotStarted.scrollIntoView();
    }
  }, [matchTimes])

  console.log('Match times', matchTimes);

  return (
      <div>
        <AppBarMain/>
        <Container maxWidth='md'>
          {matchTimes.map(matchTime => {
          return <React.Fragment>
            <Time epoch={matchTime.epoch} />
            <Table>
            {matchTime.matches.map(match => {
              return <MatchCard match={match}
                                isCurrent={match.matchId == currentMatch?.matchId}
                                onSetAsCurrent={setCurrentMatch}
                                tournament={tournament}
              />
            })}
            </Table>
            </React.Fragment>})}
        </Container>
      </div>
  )
}

const Time = ({epoch}) => {
  const date = new Date(0);
  date.setUTCSeconds(epoch);

  return <h1>{String(date.getHours()).padStart(2, '0')}:{String(date.getMinutes()).padStart(2, '0')} {date.toLocaleDateString('nb-NO', {weekday: 'long'})}</h1>
}

const MatchCard = ({match, onSetAsCurrent, isCurrent, tournament}) => {
  const classes = useStyles();
  return <React.Fragment>
    <TableRow classes={{root: match.isFinished ? classes.matchComplete : 'match-not-started'}}>
      <TableCell>
        <div>{match.court}</div>
        <div>{match.matchId}</div>
      </TableCell>
      <TableCell>
        <div>{match.homeTeam.name}</div>
        <div>{match.awayTeam.name}</div>
      </TableCell>
      <TableCell>
        <MatchScore match={match} />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onSetAsCurrent(match)}>
          <Icon>qr_code</Icon>
        </IconButton>
      </TableCell>
    </TableRow>
    {isCurrent && <QRCodeRow match={match} privateId={tournament.privateId}/>}
  </React.Fragment>
}

const MatchScore = ({match}) => {
  const classes = useStyles();
  if (match.result) {
    return <>{match.result}</>
  }
  else if (match.firebaseMatch) {
    const fbm = match.firebaseMatch;
    console.log('Live match', fbm);
    return <div>
      <div className={classes.liveHeading}>Live</div>
      <div className={classes.liveSets}>{fbm.setsWonByHomeTeam} - {fbm.setsWonByAwayTeam}</div>
      <div className={classes.livePoints}>{fbm.pointsInCurrentSet[0]} - {fbm.pointsInCurrentSet[1]}</div>
    </div>
  }
  return null;
}

const QRCodeRow = ({match, privateId}) => {
  const params = new URLSearchParams();
  params.append('name1', match.homeTeam.player1);
  params.append('name2', match.homeTeam.player2);
  params.append('name3', match.awayTeam.player1);
  params.append('name4', match.awayTeam.player2);
  params.append('matchid', match.matchId);
  params.append('tournamentid', privateId);
  const url = "http://" + window.location.host + "/match?" + params.toString();

  return <TableRow >
    <TableCell colSpan={3}>
      <Box mb={2}>
      <QRCode value={url} />
      </Box>
      <Link href={url}>Link</Link>
    </TableCell>
  </TableRow>
}


export async function getServerSideProps(context) {
  console.log('The context', context)
  return {
    props: {} //context.query, // will be passed to the page component as props
  }
}
