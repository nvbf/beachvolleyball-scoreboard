import AppBarMain from "../src/components/components/appbar";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import IconButton from "@material-ui/core/IconButton";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MUILink from "@material-ui/core/Link";
import Icon from "@material-ui/core/Icon";
import React, {useCallback, useEffect, useRef, useState} from "react";
import useProfixioMatches from "../src/hooks/useProfixioMatches";
import useFirebaseTournamentMatches from "../src/hooks/useFirebaseTournamentMatches";
import {useRouter} from 'next/router'
import QRCodeIcon from '@material-ui/icons/Edit'
import QRCode from "react-qr-code";
import Link from "next/link";
import tournament from "./tournament";
import {makeStyles} from "@material-ui/core/styles";
import {
  Button, Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent, DialogTitle, FormControlLabel,
  List,
  ListItem,
  ListItemText, TableBody
} from "@material-ui/core";


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
    display: 'flex',
    minWidth: '600px',
    '& .court': {
      fontSize: '2rem'
    },
    '& .referee': {
      fontSize: '1.3rem',
      textAlign: 'center'
    },
    '& .teams': {
      fontSize: '1rem',
      textAlign: 'center',
      marginBottom: theme.spacing(2)
    },
    '& .time': {
      fontSize: '0.8rem',
    },
    '& .mini-heading': {
      textAlign: 'center'
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
  },
  teamsPlayingCell: {
    width: '60%'
  }
}))

export default (props) => {
  const router = useRouter();
  const [currentMatch, setCurrentMatch] = useState(null);
  const [showCompletedGames, setShowCompletedGames] = useState(false);
  const classes = useStyles();
  const firstRunWithMatches = useRef(true);
  const profixioMatches = useProfixioMatches(router.query.profixioSlug);
  const {matches: firebaseMatches, tournament} = useFirebaseTournamentMatches(router.query.slug);
  const [matchTimes, setMatchTimes] = useState([]);
  useEffect(() => {
    console.log('Matches or something changed', profixioMatches, tournament, firebaseMatches);
    setMatchTimes(profixioMatches
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
          newMatch.isFinished = newMatch.firebaseMatch?.isFinished;
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
    if (matchTimes.length == 0 || firstRunWithMatches.current === false) {
      return;
    }

    console.log('Yey and stuff');

    firstRunWithMatches.current = false;
    const firstMatchNotStarted = document.querySelector('.match-not-started');
    if (firstMatchNotStarted) {
      console.log('Yeydottscroll')
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

  console.log('Match times', matchTimes);

  if (profixioMatches.length == 0) {
    return (<div>
      <AppBarMain extraTitle={'Admin ' + tournament?.name}/>
      <Container maxWidth='md'>
        <CircularProgress mode="indeterminate"/>
      </Container>
    </div>)
  }

  return (
    <div>
      <AppBarMain extraTitle={'Admin ' + tournament?.name}/>
      <Container maxWidth='md'>
        <TournamentUrlsAndInfo tournament={tournament}/>
        {matchTimes.map(matchTime => {
          return <React.Fragment key={matchTime.epoch}>
            <Time epoch={matchTime.epoch} isFinished={matchTime.isFinished}/>
            <Table>
              <TableBody>
                {matchTime.matches.map(match => {
                  return <MatchCard key={match.matchId} match={match}
                                    isCurrent={match.matchId == currentMatch?.matchId}
                                    onSetAsCurrent={toggleCurrentMatch}
                                    tournament={tournament}
                  />
                })}
              </TableBody>
            </Table>
          </React.Fragment>
        })}
      </Container>
      <div className={classes.bottomToolbar}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showCompletedGames}
              onChange={() => setShowCompletedGames(!showCompletedGames)}
              name="checkedB"
              color="primary"
            />
          }
          label="Vis ferdige kamper"
        />
      </div>
    </div>
  )
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
      <TableCell>
        <div>{match.court}</div>
        <div>{match.matchId}</div>
      </TableCell>
      <TableCell class={classes.teamsPlayingCell}>
        <Box mb={2}>
          <div>{match.homeTeam.name}</div>
          <div>{match.awayTeam.name}</div>
        </Box>
        <div>Referee: {match.referee}</div>
      </TableCell>
      <TableCell>
        <MatchScore match={match}/>
      </TableCell>
      <TableCell align='right'>
        <IconButton onClick={() => onSetAsCurrent(match)}>
          <Icon>qr_code</Icon>
        </IconButton>
      </TableCell>
    </TableRow>
    {isCurrent && <QRCodeRow match={match} onSetAsCurrent={onSetAsCurrent} privateId={tournament.privateId}/>}
  </React.Fragment>
}

const MatchScore = ({match}) => {
  const classes = useStyles();
  if (match.result) {
    return <>{match.result}</>
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

  return <Dialog open={true} onClose={() => onSetAsCurrent(false)} maxWidth='md'>
    <DialogContent>
      <div className={classes.dialog}>
        <Box mr={4}>
          <div className='time'>{epochToTimeAndDay(match.epoch)}</div>
          <div className='matchId'>#{match.matchId}</div>
          <div className='court'>{match.court}</div>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center' flexGrow={1}>
          <Box mb={4}>
            <div className={'mini-heading'}>Lag</div>
            <div className='teams'>{match.homeTeam.name} / {match.awayTeam.name}</div>
            <div className={'mini-heading'}>Dommer</div>
            <div className='referee'>{match.referee}</div>
          </Box>
          {!match.firebaseMatch && <>
            <Box mb={2} display='flex' justifyContent='center'>
              <QRCode value={url} size={300}/>
            </Box>
            <Link href={url}>Link</Link>
          </>}
          {match.firebaseMatch && <div>
            <p>Det er allerede starta score på denne kampen. Feil? Kontakt Øystein, Håkon eller noen?</p>
            <p>
              <MUILink href={firebaseLink}>Firebase link</MUILink> (Kun for Øystein)
            </p>
          </div>}
        </Box>
      </div>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' color='primary' onClick={() => onSetAsCurrent(false)}>Lukk</Button>
    </DialogActions>
  </Dialog>
}


const TournamentUrlsAndInfo = ({tournament}) => {
  const router = useRouter();
  const {protocol, host} = window.location;
  const profixioUrl = 'https://www.profixio.com/app/' + router.query.profixioSlug
  const liveScoreUrl = protocol + '//' + host + '/tournament/' + router.query.slug
  const scoreBoardUrl = protocol + '//' + host + '/tournament/' + router.query.slug + '/profixio/'+router.query.profixioSlug+'/scoreboard/by-court/Bane1'
  console.log('Tournament', tournament);
  const firebaseUrl = `https://console.firebase.google.com/u/0/project/beachvolleyball-scoreboard/database/beachvolleyball-scoreboard/data/~2Ftournament_matches~2F${tournament?.privateId}?hl=NO`
  return <List>
    <ListItem>
      <ListItemText primary={<MUILink href={profixioUrl}>{profixioUrl}</MUILink>}
                    secondary={'Profixio'}/>
    </ListItem>
    <ListItem>
      <ListItemText primary={<MUILink href={liveScoreUrl}>{liveScoreUrl}</MUILink>}
                    secondary={'Live score'}/>
    </ListItem>
    <ListItem>
      <ListItemText primary={<MUILink href={scoreBoardUrl}>{scoreBoardUrl}</MUILink>}
                    secondary={'OBS scoreboard'}/>
    </ListItem>
    <ListItem>
      <ListItemText primary={<MUILink href={firebaseUrl}>{firebaseUrl}</MUILink>}
                    secondary={'Firebase'}/>
    </ListItem>
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
