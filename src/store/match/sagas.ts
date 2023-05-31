import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, CallEffect, delay, put, PutEffect, select, SelectEffect, takeEvery, takeLatest } from 'redux-saga/effects'
import { TeamType, Team, Event } from '../../components/types';
import { addAwayTeam, AddEventPayload, addHomeTeam, addTeamError, evaluateEvents, insertEvent, MatchActionTypes, storeEvents, undoLastEvent } from "./actions";
import { db } from '../../firebase/firebase-config';
import { addEventToMatchToFirestore, getEventsFromMatch } from '../../firebase/match_service';

/*
 * Sagas intercept an action, and then dispatches API calls. When the API call resolves, it either dispatches a success action, or an error action.
 * The sagas below are mostly non-mutative. They call the API with the requested action, and then refetches the integration list after receiving a  succcess,
 * or they set an error in state if they receive an error.
 */

export function* setHomeTeam(action: PayloadAction<Team>): Generator<CallEffect<string> | PutEffect, void, string> {
  try {
    console.log(action.payload);
    put(addHomeTeam(action.payload))
    console.log("Saved home");
  } catch (error) {
    yield put(addTeamError(error as Error))
    // yield put(reportError({error} as {error: Error}))
  }
}

export function* setAwayTeam(action: PayloadAction<Team>): Generator<CallEffect<string> | PutEffect, void, string> {
  try {
    console.log(action.payload);
    put(addAwayTeam(action.payload))
    console.log("Saved away");
  } catch (error) {
    yield put(addTeamError(error as Error))
    // yield put(reportError({error} as {error: Error}))
  }
}

export function* pushNewEvent(action: PayloadAction<AddEventPayload>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {

  try {
    yield put(insertEvent(action.payload.event))
    console.log("Added new event " + action.payload.matchId);

    yield call(addEventToMatchToFirestore, action.payload.matchId, action.payload.event)

    yield put(evaluateEvents())
    console.log("Evaluated events");

  } catch (error) {
    console.log("Error when pushing new event");
  }
}

export function* getOldEvents(action: PayloadAction<string>): Generator<CallEffect | SelectEffect | PutEffect, void, Event[]> {

  try {
    console.log("check events");

    // add a new document with a generated id
    let events = yield call(getEventsFromMatch, action.payload)

    console.log(events)

    yield put(storeEvents(events))
    console.log("Store events");
    yield put(evaluateEvents())

  } catch (error) {
    console.log("Error when pushing new event");
  }
}

export function* undoEvent(action: PayloadAction<AddEventPayload>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {
  try {
    yield put(undoLastEvent())
    console.log("Undo event");

    yield call(addEventToMatchToFirestore, action.payload.matchId, action.payload.event)

    yield put(evaluateEvents())
    console.log("Evaluated events");

  } catch (error) {
    console.log("Error when pushing new event");
  }
}

export function* matchSagas() {
  yield all([
    takeEvery(MatchActionTypes.ADD_HOME_TEAM, setHomeTeam),
    takeEvery(MatchActionTypes.ADD_AWAY_TEAM, setAwayTeam),
    takeEvery(MatchActionTypes.ADD_EVENT, pushNewEvent),
    takeEvery(MatchActionTypes.CHECK_DB, getOldEvents),
    takeEvery(MatchActionTypes.UNDO_EVENT, undoEvent),
  ])

}
