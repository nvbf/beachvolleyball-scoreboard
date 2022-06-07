import { expectSaga, SagaType } from "redux-saga-test-plan";
import { rootReducer, store } from "../store";

export const baseState = store.getState()
export const testSagaWithRedux = (saga: SagaType<any>, ...sagaArgs: any[]) =>
  expectSaga(saga, ...sagaArgs)
    .withState(baseState)
    .withReducer(rootReducer)
