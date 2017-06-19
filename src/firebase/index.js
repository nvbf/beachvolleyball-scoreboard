import { init } from "../util/auth";
import firebase from "firebase";
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
  return new Promise((resolve, reject) => {
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
}

export async function getTournaments() {
  init();
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(c.TOURNAMENT_PATH)
      .once("value")
      .then(dataSnapshot => resolve(dataSnapshot.val()))
      .catch(err => reject(err));
  });
}

export function saveTournament(tournamentName) {
  init();

  const tournamentData = {
    name: tournamentName,
    publicId: tournamentName,
    privateId: parseInt(
      (Math.random() * 100000000000000000).toString().slice(-6)
    )
  };

  firebase.database().ref(c.TOURNAMENT_PATH).push(tournamentData);
  return tournamentData;
}
