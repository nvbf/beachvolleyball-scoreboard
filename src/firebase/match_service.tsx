import { collection, getDocs, addDoc, getFirestore } from "@firebase/firestore";
import { Event, EventType, Match, TournamentSecrets } from "../components/types";
import { getUID } from "./auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const addEventToMatchToFirestore = async (
  matchId: string,
  Event: Event
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const eventCollection = collection(db, "Matches", matchId, "events");
  const uid = await getUID()
  let eventWithUserID = Event
  return addDoc(eventCollection, Event)
    .then((docRef) => {
      console.log("Document written to match: %s with ID: %s", matchId, docRef.id);
      return docRef.id;
    })
    .catch((error) => {
      console.error("error adding tournament name:", error);
      throw error;
    });
}

export const getEventsFromMatch = async (
  matchId: string
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const uid = await getUID()
  const value = collection(db, "Matches", matchId, "events");
  const valueSnapshot = await getDocs(value);
  const eventList: Event[] = valueSnapshot.docs.map((doc) => ({
    id: doc.data().id,
    timestamp: doc.data().timestamp,
    eventType: doc.data().eventType,
    team: doc.data().team,
    playerId: doc.data().playerId,
    undone: doc.data().undone,
    author: doc.data().author,
    reference: doc.data().reference,
  }));
  // Create a map of event IDs that have been undone and the IDs of the events that undid them
  const undoneEvents = new Map<string, string>();
  eventList.forEach((event) => {

    if (event.eventType === EventType.Undo) {
      undoneEvents.set(event.reference, event.id);
    }
  });

  // Mark events as undone if they're in the map
  const sortedEventList = eventList.map((event) => ({
    ...event,
    undone: undoneEvents.has(event.id) ? undoneEvents.get(event.id) : "",
  }));

  // Sort the events by timestamp
  sortedEventList.sort((a, b) => a.timestamp - b.timestamp);
  return sortedEventList
}

export const getMatch = async (
  matchId: string
) => {
  console.log('Looking for id', matchId)

  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const uid = await getUID()
  console.log('Logged in with uid', uid)
  const value = doc(db, "Matches", matchId);
  const document = await getDoc(value);
  if (document.exists()) {
    let match: Match = {
      id: document.data().id,
      homeTeam: document.data().homeTeam,
      awayTeam: document.data().awayTeam,
      homeColor: document.data().homeColor,
      awayColor: document.data().awayColor,
      matchId: document.data().matchId,
      tournamentId: document.data().tournamentId,
      timestamp: document.data().timestamp,
    }
    console.log('Got match with id', matchId)

    return match
  }
  let match: Match = {
    id: "",
    homeTeam: {
      player1Name: "",
      player2Name: "",
    },
    awayTeam: {
      player1Name: "",
      player2Name: "",
    },
    homeColor: "",
    awayColor: "",
    matchId: "",
    tournamentId: "",
    timestamp: 0,
  }
  return match
}

export const getTournamentSecrets = async (
  slug: string
) => {
  console.log('Getting secrets for ', slug)

  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const uid = await getUID()
  console.log('Logged in with uid', uid)
  const value = doc(db, "TournamentSecrets", slug);
  const document = await getDoc(value);
  if (document.exists()) {
    let tournamentSecrets: TournamentSecrets = {
      id: document.data().ID,
      secret: document.data().Secret,
    }
    console.log('Got secret from tournament with id', tournamentSecrets.id)

    return tournamentSecrets
  }
  let tournamentSecrets: TournamentSecrets = {
    id: "nan",
    secret: ""
  }
  return tournamentSecrets
}


export const initNewMatch = async (
  match: Match,
  id: string
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const matches = doc(db, "Matches", id);

  return setDoc(matches, match)
    .then(() => {
      console.log("Document written with ID:", id);
      return id;
    })
    .catch((error) => {
      console.error("error adding tournament name:", error);
      throw error;
    });
}

export const setScoreboardId = async (
  match: Match,
  id: string
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const docRef = doc(db, "Tournaments", match.tournamentId, "Matches", match.matchId);

  await updateDoc(docRef, {
    ScoreboardId: id,
    CurrentScore: []
  });
}

export const setStartTime = async (
  tournamentId: string,
  matchId: string,
  startTime: number
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const docRef = doc(db, "Tournaments", tournamentId, "Matches", matchId);

  await updateDoc(docRef, {
    MatchStartTimestamp: startTime
  });
}

export const setScoreboardScore = async (
  tournamentId: string,
  matchId: string,
  currentScore: { [key: string]: number }[],
  currentSetScore: { [key: string]: number }
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const docRef = doc(db, "Tournaments", tournamentId, "Matches", matchId);

  await updateDoc(docRef, {
    CurrentScore: currentScore,
    CurrentSetScore: currentSetScore,
    IsStarted: true
  });
}

export const setMatchFinalized = async (
  tournamentId: string,
  matchId: string,
) => {
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)
  const docRef = doc(db, "Tournaments", tournamentId, "Matches", matchId);

  await updateDoc(docRef, {
    IsFinalized: true
  });
}

export const setMatchResult = async (
  matchId: string,
) => {
  const uid = await getUID()
  console.log('Logged in with uid', uid)

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const idToken = await user.getIdToken(); // Retrieve the Firebase ID token

  console.log('Logged in with uid', user.uid);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/match/v1/result/${matchId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`, // Include the ID token in the Authorization header
      'Content-Type': 'application/json', // Set Content-Type header to application/json
    },
  });

  if (response.status === 403) {
    throw new Error('Forbidden: Access is denied');
  }

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
}