import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, CallEffect, delay, put, PutEffect, select, SelectEffect, takeEvery, takeLatest } from 'redux-saga/effects'
import { TeamType, Team, Event } from '../../components/types';
import { addAwayTeam, addHomeTeam, addTeamError, evaluateEvents, insertEvent, MatchActionTypes, undoLastEvent } from "./actions";

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

export function* pushNewEvent(action: PayloadAction<Event>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {
  try {
    yield put(insertEvent(action.payload))
    console.log("Added new event");

    yield put(evaluateEvents())
    console.log("Evaluated events");

  } catch (error) {
    console.log("Error when pushing new event");
  }
}

export function* undoEvent(action: PayloadAction<Event>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {
  try {
    yield put(undoLastEvent())
    console.log("Undo event");

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
    takeEvery(MatchActionTypes.UNDO_EVENT, undoEvent),
  ])
  
}
