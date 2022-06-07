
import saga from 'redux-saga'
import { all } from 'redux-saga/effects'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import { select } from "redux-saga/effects";
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { teamsReducer } from './teams/reducer'
import { teamsSagas } from './teams/sagas'

export const rootReducer = combineReducers({
    team: teamsReducer
})

const sagaMiddleware = saga()

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), sagaMiddleware],
})

function* rootSaga() {
    yield all([
        teamsSagas(),
    ])
}

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export function* appSelect<TSelected>( selector: (state: RootState) => TSelected, ): Generator<any, TSelected, TSelected> { return yield select(selector); }
