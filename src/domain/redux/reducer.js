import { Map } from 'immutable';
import { combineReducers, } from 'redux-immutable';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';


import undoable from 'redux-undo-immutable';
import { ActionCreators } from 'redux-undo-immutable';

import scoreReducer from './score/reducer';
import teamReducser from './team/reducer';

import {
    SCORE,
    TEAM 
} from './constants';



// const rootReducer = combineReducers({
//     [SCORE]: scoreReducer,
//     [TEAM]: teamReducser
// });

// const store = createStore(
//     rootReducer,
//     composeWithDevTools()
// );

const initialState = Immutable.Map();
const rootReducer = combineReducers({});
const store = createStore(rootReducer, initialState);

export default store;