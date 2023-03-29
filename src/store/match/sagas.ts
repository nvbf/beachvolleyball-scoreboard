import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, CallEffect, delay, put, PutEffect, select, SelectEffect, takeEvery, takeLatest } from 'redux-saga/effects'
import { Actor, Stopwatch, Team } from '../../components/types';
import { addAwayTeam, addHomeTeam, addPoint, addTeamError, evaluateScores, initStopwatch, MatchActionTypes, setTick, showNotification, startStopwatch } from "./actions";

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

export function* scorePoint(action: PayloadAction<Actor>): Generator<CallEffect | SelectEffect | PutEffect, void, string> {
  try {
    yield put(addPoint(action.payload))
    console.log("Added addPoint");

    yield put(showNotification())
    console.log("Added showNotification");
    let technicalTimeout = yield select(isTechnicalTimeout); // <-- get the project
    console.log("technicalTimeout value:" + technicalTimeout);

    if (technicalTimeout) {
      yield call(startStopwatchSaga);
      console.log("startStopwatch");

    }
  } catch (error) {
    yield put(addTeamError(error as Error))
    // yield put(reportError({error} as {error: Error}))
  }
}

export function* startStopwatchSaga(): Generator<CallEffect | SelectEffect | PutEffect, void, string> {

  try {
    yield put(initStopwatch())
    console.log("Did tick");
    yield call(stopwatchSelfTickSaga);
  } catch (error) {
    console.log(error);

    console.log("Could not start tick");
  }
}

export function* stopwatchSelfTickSaga(): Generator<CallEffect | SelectEffect | PutEffect, void, boolean> {
  let loop = true

  try {
    yield delay(1000);
    yield put(setTick())
    loop = yield select(getRunStopwatch); // <-- get the project
    if (loop) {
      yield call(stopwatchSelfTickSaga)
    }

  } catch (error) {
    console.log("Stopped tick:" + error);
    loop = false
  }
}

export const getRunStopwatch = (state: { match: { runStopwatch: boolean; }; }) => state.match.runStopwatch
export const isTechnicalTimeout = (state: { match: { technicalTimeout: boolean; }; }) => state.match.technicalTimeout


export function* matchSagas() {
  yield all([
    takeEvery(MatchActionTypes.ADD_HOME_TEAM, setHomeTeam),
    takeEvery(MatchActionTypes.ADD_AWAY_TEAM, setAwayTeam),
    takeEvery(MatchActionTypes.POINT_SCORED, scorePoint),
    takeEvery(MatchActionTypes.START_STOPWATCH, startStopwatchSaga),
  ])
}