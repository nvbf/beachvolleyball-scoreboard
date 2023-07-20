import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, CallEffect, delay, put, PutEffect, select, SelectEffect, takeEvery, takeLatest } from 'redux-saga/effects'
import { TeamType, Team, Event, Match } from '../../components/types';
import { addAwayTeam, addEvent, AddEventPayload, addHomeTeam, addTeamError, checkDb, evaluateEvents, finalizeMatch, initMatch, insertEvent, publishScores, storeEvents, storeMatch, undoEvent, undoLastEvent } from "./reducer";
import { db } from '../../firebase/firebase-config';
import { addEventToMatchToFirestore, getEventsFromMatch, getMatch, initNewMatch, setMatchFinalized, setScoreboardId, setScoreboardScore, setStartTime } from '../../firebase/match_service';
import { v4 } from 'uuid';
import { RootState } from '../store';
import { matchState } from '../types';

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

const getSomePartOfState = (state: RootState) => state.match;


export function* pushNewEvent(action: PayloadAction<AddEventPayload>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {

  try {
    yield put(insertEvent(action.payload.event))
    console.log("Added new event " + action.payload.id);

    yield put(evaluateEvents())
    console.log("Evaluated events");

    yield call(addEventToMatchToFirestore, action.payload.id, action.payload.event)

    yield put(publishScores())

  } catch (error) {
    console.log("Error when pushing new event");
  }
}


export function* publishScoresToTournaments(action: PayloadAction): Generator<CallEffect | SelectEffect | PutEffect, void, matchState> {

  try {
    const matchState: matchState = yield select(getSomePartOfState);
    console.log("publishScoresToTournaments events %s", matchState.theCurrentSets);
    console.log((matchState.currentScore[TeamType.Home] + " - " + matchState.currentScore[TeamType.Home]))
    yield call(
      setScoreboardScore, matchState.tournamentId, matchState.matchId,
      matchState.theCurrentSets, matchState.currentSetScore
    )

    if (matchState.currentSet === 1 && (matchState.currentScore[TeamType.Home] + matchState.currentScore[TeamType.Away]) === 1) {
      yield call(setStartTime, matchState.tournamentId, matchState.matchId, matchState.startTime)
    }

  } catch (error) {
    console.log("Error when publishing scores");
  }
}

export function* getOldEvents(action: PayloadAction<string>): Generator<CallEffect | SelectEffect | PutEffect, void, Event[]> {

  try {
    console.log("check events");

    // add a new document with a generated id
    let events = yield call(getEventsFromMatch, action.payload);

    yield put(storeEvents(events))
    console.log("Store events");
    yield put(evaluateEvents())
  } catch (error) {
    console.log("Error when getting old events");
  }
}

export function* getOldMatch(action: PayloadAction<string>): Generator<CallEffect | SelectEffect | PutEffect, void, Match> {

  try {
    console.log("check events with id %s", action.payload);

    // add a new document with a generated id
    let match = yield call(getMatch, action.payload);

    console.log(match)

    yield put(storeMatch(match))
    console.log("Store match");
  } catch (error) {
    console.log("Error when getting old match");
  }
}
export function* undoGivenEvent(action: PayloadAction<AddEventPayload>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {
  try {
    yield put(undoLastEvent())
    console.log("Undo event");

    yield put(evaluateEvents())
    console.log("Evaluated events");

    yield call(addEventToMatchToFirestore, action.payload.id, action.payload.event)

  } catch (error) {
    console.log("Error when undoing event");
  }
}

export function* initializeMatch(action: PayloadAction<Match>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {

  try {

    yield call(initNewMatch, action.payload, action.payload.id)
    yield call(setScoreboardId, action.payload, action.payload.id)

    window.location.href = "/match/" + action.payload.id;

  } catch (error) {
    console.log("Error when init match");
  }
}

export function* finalizeEndedMatch(action: PayloadAction): Generator<CallEffect | SelectEffect | PutEffect, void, matchState> {

  try {
    const matchState: matchState = yield select(getSomePartOfState);
    console.log("To finalize");

    yield call(setMatchFinalized, matchState.tournamentId, matchState.matchId)
    console.log("Is Finalized");


  } catch (error) {
    console.log("Error when init match");
  }
}

export function* matchSagas() {
  yield all([
    takeEvery(addHomeTeam.type, setHomeTeam),
    takeEvery(addAwayTeam.type, setAwayTeam),
    takeEvery(addEvent.type, pushNewEvent),
    takeEvery(checkDb.type, getOldEvents),
    takeEvery(checkDb.type, getOldMatch),
    takeEvery(undoEvent.type, undoGivenEvent),
    takeEvery(initMatch.type, initializeMatch),
    takeEvery(publishScores.type, publishScoresToTournaments),
    takeEvery(finalizeMatch.type, finalizeEndedMatch),

  ])
}
