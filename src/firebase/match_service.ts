import { collection, getDocs, addDoc, getFirestore } from "@firebase/firestore";
import { Event, EventType } from "../components/types";
import { getUID } from "./auth";

export const addEventToMatchToFirestore = async (
  matchId: string,
  Event: Event
) => {
  let db = getFirestore()
  const eventCollection = collection(db, "Matches", matchId, "events");
  return addDoc(eventCollection, Event)
    .then((docRef) => {
      console.log("Document written with ID:", docRef.id);
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
  let db = getFirestore()
  const uid = await getUID()
  console.log('Logged in with uid', uid)
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
    console.log(event)

    if (event.eventType === EventType.Undo) {
      console.log("undoneEvents")
      undoneEvents.set(event.reference, event.id);
      console.log(undoneEvents)
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
