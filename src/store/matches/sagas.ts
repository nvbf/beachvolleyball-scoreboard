import { all} from 'redux-saga/effects'

/*
 * Sagas intercept an action, and then dispatches API calls. When the API call resolves, it either dispatches a success action, or an error action.
 * The sagas below are mostly non-mutative. They call the API with the requested action, and then refetches the integration list after receiving a  succcess,
 * or they set an error in state if they receive an error.
 */


export function* matchesSagas() {
  yield all([
  ])
}
