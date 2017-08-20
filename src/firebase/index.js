import firebase from "firebase";
import slugify2 from "slugify2";

import { getUID } from "../util/auth";
import AllAction from "../../src/domain/tide/actions";
import { constants as c } from "../domain/tide/state";

import {
  isMatchFinished,
  getScoreFromFirstSet,
  getScoreFromSecondSet,
  getScoreFromThirdSet,
  getSetResult,
  getPointsInCurrentSetAsString,
  getScoreForCompletedSets
} from "../domain/tide/logic";

function extractDataMatchToTournament(match) {
  const h1Player = match[c.HOMETEAM_FIRST_PLAYER_NAME];
  const h2Player = match[c.HOMETEAM_SECOND_PLAYER_NAME];
  const b1Player = match[c.AWAYTEAM_FIRST_PLAYER_NAME];
  const b2Player = match[c.AWAYTEAM_SECOND_PLAYER_NAME];

  const isFinished = isMatchFinished(match);
  const pointsInCurrentSet = getPointsInCurrentSetAsString(match);
  const scoreInCompletedSet = getScoreForCompletedSets(match);
  const currentPoints = getPointsInCurrentSetAsString;

  return {
    h1Player,
    h2Player,
    b1Player,
    b2Player,
    isFinished,
    pointsInCurrentSet,
    scoreInCompletedSet,
    currentPoints
  };
}

export async function save(tournamentId = 0, matchId, match) {
  const uid = await getUID();
  match.userId = uid;
  const matchState = JSON.stringify(match.match);
  let updates = {};

  // need to get slug from TournamentId
  if (tournamentId !== 0) {
    console.log("tournamentId", tournamentId);
    const slug = getSlugFromTournamentId(tournamentId);
    const matchInfo = extractDataMatchToTournament(match);
    console.log("matchID", matchId);
    updates[matchInTournamentPath(uid, slug, matchId)] = matchInfo;
  }
  match.match = matchState;
  console.log("path", getMatchPath(matchId));
  console.log("matchState", match);
  updates[getMatchPath(matchId)] = match;
  return firebase.database().ref().update(updates);
}

let slugFromId = {};
export async function getSlugFromTournamentId(tournamentId) {
  if (slugFromId[tournamentId]) {
    const tournament = await getTournament(tournamentId);
    slugFromId[tournamentId] = tournament.slug;
  }
  return slugFromId[tournamentId];
}

export async function observeTournament(slug, observer) {
  const uid = await getUID();
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(myTournamentPath(uid, slug))
      .once("value")
      .then(dataSnapshot => {
        const tournament = dataSnapshot.val();
        observer(tournament);
      })
      .catch(err => console.error("Error in observeTournament", err));
  });
}

export async function getMatches(matches) {
  const keys = Object.keys(matches) || [];
  keys.forEach(key => {
    const match = matches[key];
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

function myTournamentsPath(uid) {
  return `${c.TOURNAMENT_PATH}/${uid}`;
}

function tournamentPathConn() {
  return firebase.database().ref(c.TOURNAMENT_PATH);
}

async function getTournament(tournamentId) {
  return new Promise((resolve, reject) => {
    tournamentPathConn()
      .orderByChild("tournamentId")
      .equalTo(tournamentId)
      .once("value")
      .then(function(dataSnapshot) {
        resolve(dataSnapshot.val());
      })
      .catch(err => reject(err));
  });
}

function myMatcheConn(matchKey) {
  return firebase.database().ref(getMatchPath(matchKey));
}

function myTournamentPath(uid, slug) {
  return `${myActiveTournamentsPath(uid)}/${slug}`;
}

function myActiveMatchesInTournamentPath(uid, slug) {
  return myTournamentPath(uid, slug) + "/active";
}

function matchInTournamentPath(uid, slug, matchId) {
  return `${myActiveMatchesInTournamentPath(uid, slug)}/${matchId}`;
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
