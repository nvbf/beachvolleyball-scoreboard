import AppBarMain from "../src/components/components/appbar";

import {Table, TableRow, TableRowColumn} from "material-ui/Table";

import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import List from "material-ui/List";
import React, {useCallback, useEffect, useState} from "react";
import useProfixioMatches from "../src/hooks/useProfixioMatches";
import useFirebaseTournamentMatches from "../src/hooks/useFirebaseTournamentMatches";
import QRCode from "react-qr-code";
import Link from "next/link";

import {makeStyles} from "material-ui/styles";
import {ListItem, MuiThemeProvider, RaisedButton} from "material-ui";


const useStyles = makeStyles(theme => ({
  matchComplete: {
    textDecoration: 'line-through',
    opacity: 0.5
  },
  finishedTime: {
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
  },
  dialog: {
    textAlign: 'center',
    '& > .court': {
      fontSize: '2rem'
    }
  },
  bottomToolbar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

export default (props) => {
  console.log('The props is', props);
  const {query} = props.url
  const [currentMatch, setCurrentMatch] = useState(null);
  const [showCompletedGames, setShowCompletedGames] = useState(false);
  const classes = useStyles();
  const profixioMatches = useProfixioMatches(query.profixioSlug);
  const {matches: firebaseMatches, tournament} = useFirebaseTournamentMatches(query.slug);
  const [matchTimes, setMatchTimes] = useState([]);
  useEffect(() => {
    console.log('Matches or something changed', tournament);
    setMatchTimes(profixioMatches
      .sort((a, b) => (a.epoch - b.epoch) || (a.court.localeCompare(b.court)))
      .reduce((allTimes, match) => {
        if (!showCompletedGames && match.isFinished) {
          return allTimes;
        }
        let lastTime = allTimes[allTimes.length - 1];
        if (!lastTime || match.epoch != lastTime.epoch) {
          allTimes.push({
            epoch: match.epoch,
            matches: []
          });
          lastTime = allTimes[allTimes.length - 1];
        }
        const newMatch = {...match};
        newMatch.firebaseMatch = firebaseMatches && firebaseMatches[newMatch.matchId]
        if (!newMatch.isFinished) {
          newMatch.isFinished = newMatch.firebaseMatch && newMatch.firebaseMatch.isFinished;
        }
        lastTime.matches.push(newMatch);
        return allTimes;
      }, [])
      .map(time => {
        time.isFinished = !time.matches.find(match => !match.isFinished)
        return time;
      })
    );
  }, [firebaseMatches, profixioMatches, showCompletedGames])

  useEffect(() => {
    const firstMatchNotStarted = document.querySelector('.match-not-started');
    if (firstMatchNotStarted) {
      firstMatchNotStarted.scrollIntoView();
    }
  }, [matchTimes])

  const toggleCurrentMatch = (match) => {
    setCurrentMatch(currentMatch => {
      if (currentMatch && currentMatch.matchId == match.matchId) {
        return null;
      }
      return match;
    })
  }

  return (<React.Fragment>
    <Head>
      <title>Scorecard for the Lazy Volleyball Referee</title>
      <link rel="stylesheet" href="/static/css/profixio.css" type="text/css"/>
    </Head>
    <div>
      <Container maxWidth='md'>
        <CircularProgress mode="indeterminate"/>
      </Container>
    </div>
  </React.Fragment>)

}

const epochToTimeAndDay = (epoch) => {
  const date = new Date(0);
  date.setUTCSeconds(epoch);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${date.toLocaleDateString('nb-NO', {weekday: 'long'})}`
}

const Time = ({epoch, isFinished}) => {
  const classes = useStyles();

  return <h1 className={isFinished ? classes.finishedTime : ''}>{epochToTimeAndDay(epoch)}</h1>
}

const MatchCard = ({match, onSetAsCurrent, isCurrent, tournament}) => {
  const classes = useStyles();
  return <React.Fragment>
    <TableRow classes={{root: match.isFinished ? classes.matchComplete : 'match-not-started'}}>
      <TableRowColumn>
        <div>{match.court}</div>
        <div>{match.matchId}</div>
      </TableRowColumn>
      <TableRowColumn>
        <div className={classes.mb2}>
          <div>{match.homeTeam.name}</div>
          <div>{match.awayTeam.name}</div>
        </div>
        <div>Referee: {match.referee}</div>
      </TableRowColumn>
      <TableRowColumn>
        <MatchScore match={match}/>
      </TableRowColumn>
      <TableRowColumn align='right'>
        {/*
        <IconButton onClick={() => onSetAsCurrent(match)}>
          <Icon>qr_code</Icon>
        </IconButton>
        */}
      </TableRowColumn>
    </TableRow>
    {isCurrent && <QRCodeRow match={match} onSetAsCurrent={onSetAsCurrent} privateId={tournament.privateId}/>}
  </React.Fragment>
}

const MatchScore = ({match}) => {
  const classes = useStyles();
  if (match.result) {
    return <React.Fragment>{match.result}</React.Fragment>
  } else if (match.firebaseMatch) {
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

const QRCodeRow = ({match, privateId, onSetAsCurrent}) => {
  const classes = useStyles();
  const params = new URLSearchParams();
  params.append('name1', getShortPlayerName(match.homeTeam.players[0]));
  params.append('name2', getShortPlayerName(match.homeTeam.players[1]));
  params.append('name3', getShortPlayerName(match.awayTeam.players[0]));
  params.append('name4', getShortPlayerName(match.awayTeam.players[1]));
  params.append('matchid', match.matchId);
  params.append('tournamentid', privateId);
  const url = window.location.protocol + "//" + window.location.host + "/match?" + params.toString();

  const firebaseLink = `https://console.firebase.google.com/u/0/project/beachvolleyball-scoreboard/database/beachvolleyball-scoreboard/data/~2Ftournament_matches~2F${privateId}~2F${encodeURIComponent(match.matchId)}~2F?hl=NO`;

  const title = <div className={classes.dialog}>
    <div className='time'>{epochToTimeAndDay(match.epoch)}</div>
    <div className='teams'>{match.homeTeam.name} - {match.awayTeam.name}</div>
    <div className='court'>{match.court}</div>
  </div>

  const actions = [
    <RaisedButton primary='true' nClick={() => onSetAsCurrent(false)} label='Lukk' />
  ]

  return <Dialog open={true}
                 title={title}
                 actions={actions}
                 onRequestClose={() => onSetAsCurrent(false)}>

    {!match.firebaseMatch && <React.Fragment>
      <div className={classes.mb2}>
        <QRCode value={url} size={300}/>}
      </div>
      <Link href={url}>Link</Link>
    </React.Fragment>}
    {match.firebaseMatch && <div>
      <p>Det er allerede starta score på denne kampen. Feil? Kontakt Øystein, Håkon eller noen?</p>
      <p>
        <a href={firebaseLink}>Firebase link</a> (Kun for Øystein)
      </p>
    </div>}
  </Dialog>
}


const TournamentUrlsAndInfo = ({tournament}) => {
  const router = useRouter();
  const {protocol, host} = window.location;
  const profixioUrl = 'https://www.profixio.com/app/' + router.query.profixioSlug
  const liveScoreUrl = protocol + '//' + host + '/tournament/' + router.query.slug
  console.log('Tournament', tournament);
  const firebaseUrl = `https://console.firebase.google.com/u/0/project/beachvolleyball-scoreboard/database/beachvolleyball-scoreboard/data/~2Ftournament_matches~2F${tournament ? tournament.privateId : ''}?hl=NO`
  return <List>
    <ListItem primaryText={<a href={profixioUrl}>{profixioUrl}</a>}
              secondaryText={'Profixio'}/>
    <ListItem primaryText={<MUILink href={liveScoreUrl}>{liveScoreUrl}</MUILink>}
              secondaryText={'Live score'} />
    <ListItem primaryText={<MUILink href={firebaseUrl}>{firebaseUrl}</MUILink>}
              secondaryText={'Firebase'}/>
  </List>
}

const getShortPlayerName = (player) => {
  const nameParts = player.trim().split(/\s+/);
  if (nameParts.length == 1) {
    return nameParts[0];
  }

  const lastName = nameParts.pop();
  const firstName = nameParts
    .map(namePart => namePart[0].toLocaleUpperCase() + ".")
    .join(' ')
  return firstName + ' ' + lastName;
}

export async function getServerSideProps(context) {
  console.log('The context', context)
  return {
    props: {} //context.query, // will be passed to the page component as props
  }
}

const Container = ({children, maxWidth}) => {
  return <div>
    {children}
  </div>
}
