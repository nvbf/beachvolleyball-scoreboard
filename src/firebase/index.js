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
  updates[c.MATCH_PATH + matchId] = match;
  return firebase.database().ref().update(updates);
}

export async function getTournament(slug) {
  const uid = await getUID();
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(myTournamentPath(uid, slug))
      .once("value")
      .then(dataSnapshot => {
        const tournaments = dataSnapshot.val();
        console.log("tournaments", tournaments);
        if (!tournaments) {
          resolve({});
        }
        resolve({ tournament: tournaments });
      })
      .catch(err => reject(err));
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
  console.log(`${myActiveTournamentsPath(uid)}/${slug}`);
  return `${myActiveTournamentsPath(uid)}/${slug}`;
}

function myActiveTournamentsPath(uid) {
  return `${myTournamentsPath(uid)}/active`;
}
