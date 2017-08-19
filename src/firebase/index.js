import firebase from "firebase";
import slugify2 from "slugify2";
import { init, startAnonymousAuth, getAuthUser } from "../util/auth";
import AllAction from "../../src/domain/tide/actions";
import { constants as c } from "../domain/tide/state";

export function save(tournamentId = 0, matchId, match) {
  init();
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
  init();
  startAnonymousAuth();
  const user = getAuthUser();
  if (!user) {
    return {};
  }
  const promise = new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(c.TOURNAMENT_PATH)
      .orderByChild("name")
      .equalTo(slug)
      .once("value")
      .then(dataSnapshot => {
        const tournaments = dataSnapshot.val();
        const keys = Object.keys(tournaments);
        const key = keys[0];
        const tournament = tournaments[key] || {};
        const id = tournament.privateId;
        console.log("tournament.privateId", tournament.privateId);
        resolve({ tournament });
      })
      .catch(err => reject(err));
  });
  return await promise;
}

export async function getMyTournaments() {
  init();
  startAnonymousAuth();
  const user = getAuthUser();
  if (!user || !firebase.apps.length) {
    return Promise.resolved({});
  }

  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(myActiveTournamentsPath())
      .once("value")
      .then(dataSnapshot => {
        console.log('dataSnapshot', dataSnapshot)
        console.log('val', dataSnapshot.val())
        resolve(dataSnapshot.val() || {} )
      })
      .catch(err => {
        console.log("rejected - getMyTournaments", err);
        reject(err);
      });
  });
}

export function saveTournament(tournamentName) {
  const user = getAuthUser();
  if (!user) {
    return console.log("Could not save tournament, user is not logged in");
  }
  console.log("userid", user.uid);
  const tournamentData = {
    userId: user.uid,
    name: tournamentName,
    publicId: slugify2(tournamentName),
    privateId: parseInt(
      (Math.random() * 100000000000000000).toString().slice(-6)
    )
  };

  firebase.database().ref(myActiveTournamentsPath()).push(tournamentData);
  return tournamentData;
}

function myTournamentPath() {
  const user = getAuthUser();
  if (!user) {
    throw new Error("User do not exist");
  }
  return `${c.TOURNAMENT_PATH}/${user.uid}`;
}

function myTournamentPath() {
  const user = getAuthUser();
  if (!user) {
    throw new Error("User do not exist");
  }
  return `${c.TOURNAMENT_PATH}/${user.uid}`;
}

function myActiveTournamentsPath() {
  return `${myTournamentPath()}/active`;
}
