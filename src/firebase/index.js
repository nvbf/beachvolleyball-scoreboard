import firebase from "firebase";
import slugify2 from "slugify2";

import { getUID } from "../util/auth";
import AllAction from "../../src/domain/tide/actions";
import {constants as c, LAST_POINTS_LIST} from "../domain/tide/state";

import {
  isMatchFinished,
  getScoreFromFirstSet,
  getScoreFromSecondSet,
  getScoreFromThirdSet,
  getSetResult,
  getPointsInCurrentSet,
  getScoreForCompletedSets,
  getAwayTeamSetsWon,
  getHomeTeamSetsWon,
  hasHomeTeamWonMatch, getTimeoutTakenInCurrentSet, personToServe, getScoreForCompletedSetsAsArray
} from "../domain/tide/logic";


function extractDataMatchToTournament(state) {
  const match = state.get(c.MATCH);

  const h1Player = match[c.HOMETEAM_FIRST_PLAYER_NAME];
  const h2Player = match[c.HOMETEAM_SECOND_PLAYER_NAME];
  const b1Player = match[c.AWAYTEAM_FIRST_PLAYER_NAME];
  const b2Player = match[c.AWAYTEAM_SECOND_PLAYER_NAME];
  const homeTeamTimeoutTaken = getTimeoutTakenInCurrentSet(c.HOMETEAM, match);
  const awayTeamTimeoutTaken = getTimeoutTakenInCurrentSet(c.AWAYTEAM, match);

  // personToServe require complete state to calculate server:
  const pts = personToServe(state)
  console.log('Current server', pts);
  const servingTeam = pts ? pts.team : null;
  const matchId = match[c.MATCH_ID];

  console.log("match???", match);
  const isFinished = isMatchFinished(match);
  const pointsInCurrentSet = getPointsInCurrentSet(match);
  const scoreInCompletedSet = getScoreForCompletedSets(match);
  const setsWonByHomeTeam = getHomeTeamSetsWon(match);
  const setsWonByAwayTeam = getAwayTeamSetsWon(match);
  const lastPointsList = [...match[LAST_POINTS_LIST]]
  const scoreInCompletedSetAsArray = getScoreForCompletedSetsAsArray(match)

  let winner = "";
  let timeFinished = ""
  if (isFinished) {
    winner = hasHomeTeamWonMatch(match) ? c.HOMETEAM : c.AWAYTEAM;
    timeFinished = match[c.MATCH_FINISHED_TIMESTAMP];
  }

  return {
    h1Player,
    h2Player,
    b1Player,
    b2Player,
    isFinished,
    pointsInCurrentSet,
    scoreInCompletedSet,
    scoreInCompletedSetAsArray,
    setsWonByHomeTeam,
    setsWonByAwayTeam,
    winner,
    matchId,
    timeFinished,
    homeTeamTimeoutTaken,
    awayTeamTimeoutTaken,
    servingTeam,
    lastPointsList,
  };
}

export async function save(tournamentId = 0, matchKey, match, completeState) {
  const uid = await getUID();
  match.userId = uid;
  const matchId = match.match.get(c.MATCH)[c.MATCH_ID];
  const matchState = JSON.stringify(match.match);
  let updates = {};

  // need to get slug from TournamentId
  if (tournamentId !== 0) {
    console.log("tournamentId", tournamentId);
    const matchInfo = extractDataMatchToTournament(completeState);
    console.log('Match info', matchInfo);
    matchInfo.userId = uid;
    console.log("matchId", matchId);
    updates[matchInTournamentPath(tournamentId, matchId)] = matchInfo;
  }
  match.match = matchState;
  console.log("path", getMatchPath(matchKey));
  console.log("matchState", match);
  updates[getMatchPath(matchKey)] = match;
  return firebase.database().ref().update(updates);
}

export async function getTournament(slug) {
  const uid = await getUID();
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('/tournament_slugs/' + slug)
      .once("value")
      .then(dataSnapshot => resolve(dataSnapshot.val()))
      .catch(err => reject(err));
  });
}

export async function matchesFromTournament(tournamentPrivateId, setState) {
  tournamentPrivateId;
  firebase
    .database()
    .ref(`tournament_matches/${tournamentPrivateId}`)
    .on("value", function(snapshot) {
      setState({ matches: snapshot.val() });
    });
}

export async function getMyTournaments() {
  const uid = await getUID();
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(myActiveTournamentsPath(uid))
      .once("value")
      .then(dataSnapshot => {
        console.log("dataSnapshot", dataSnapshot);
        console.log("val", dataSnapshot.val());
        resolve(dataSnapshot.val() || {});
      })
      .catch(err => {
        console.log("rejected - getMyTournaments", err);
        reject(err);
      });
  });
}

export async function saveTournament(tournamentName) {
  const uid = await getUID();
  console.log("uid", uid);
  const tournamentData = {
    userId: uid,
    name: tournamentName,
    slug: slugify2(tournamentName),
    privateId: parseInt(
      (Math.random() * 100000000000000000).toString().slice(-6)
    )
  };

  setTournamentSlugData(tournamentData.slug, tournamentData)

  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(myTournamentPath(uid, tournamentData.slug))
      .set(tournamentData, (value, err) => {
        if (err) {
          return reject(err);
        }
        resolve(tournamentData);
      });


  });

}


function setTournamentSlugData(slug, data) {
  return firebase.database().ref('/tournament_slugs/' +  slug)
    .set(data, (value, err) => {
        if (err) {
          console.log(err);
        }
        console.log('setTournamentSlugData ok ');
    })
}


function myTournamentsPath(uid) {
  return `${c.TOURNAMENT_PATH}/${uid}`;
}

function tournamentPathConn() {
  return firebase.database().ref(c.TOURNAMENT_PATH);
}


function myTournamentPath(uid, slug) {
  return `${myActiveTournamentsPath(uid)}/${slug}`;
}

function myActiveMatchesInTournamentPath(uid, slug) {
  return myTournamentPath(uid, slug) + "/active";
}

function matchInTournamentPath(tournamentId, matchId) {
  return `tournament_matches/${tournamentId}/${matchId}`;
}

function myActiveMatchesInTournamentPathConn(uid, slug) {
  return firebase.database().ref(myActiveTournamentsPath(uid));
}

function getMatchPath(key) {
  return `${c.MATCH_PATH}${key}`;
}

function myMatcheConn(matchKey) {
  return firebase.database().ref(getMatchPath(matchKey));
}

function myActiveTournamentsPath(uid) {
  return `${myTournamentsPath(uid)}/active`;
}
