import firebase from "firebase";
import slugify2 from "slugify2";
import { getUID } from "../util/auth";
import AllAction from "../../src/domain/tide/actions";
import { constants as c } from "../domain/tide/state";

export async function save(tournamentId = 0, matchId, match) {
  const uid = await getUID();
  const matchData = {
    match,
    tournamentId,
    matchId
  };
  let updates = {};
  updates[getMatchPath(matchId)] = match;
  return firebase.database().ref().update(updates);
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

function myTournamentPath(uid, slug) {
  return `${myActiveTournamentsPath(uid)}/${slug}`;
}

function myActiveMatchesInTournamentPath(uid, slug) {
  return myTournamentPath(uid, slug) + "/active";
}

function myActiveMatchesInTournamentPathConn(uid, slug) {
  return firebase.database().ref(myActiveTournamentsPath(uid));
}

function getMatchPath(key) {
  return `${c.MATCH_PATH}/${key}`;
}

function myMatcheConn(matchKey) {
  return firebase.database().ref(getMatchPath(matchKey));
}

function myActiveTournamentsPath(uid) {
  return `${myTournamentsPath(uid)}/active`;
}
