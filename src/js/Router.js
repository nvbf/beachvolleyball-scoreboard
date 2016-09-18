import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { routerMiddleware, push, syncHistoryWithStore } from 'react-router-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { combineReducers } from 'redux-immutable'
import { Provider } from 'react-redux'

import { teamReducer } from './team/reducer';
import routerReducer from './routeReducer';
import { TEAM } from './constants'

const routers = combineReducers({
  [TEAM]: teamReducer,
  routing: routerReducer
})

const middleware = compose(
  // applyMiddleware(routerMiddleware(browserHistory)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)

const store = createStore(routers, middleware);

//const selectLocationState = state => state.get('routing').toJS();
// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store, { selectLocationState });

import AddHomeTeam from './team/AddHomeTeam';
import AddAwayTeam from './team/AddAwayTeam';
import Scoreboard from './scoreboard/Scoreboard';

const NoApp = () => <div>Fant ikke noe her :/ </div>;
//TODO: Move PublicBoard to it's own app, see git history

ReactDom.render(
  <div>
   <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={AddHomeTeam} />
        <Route path="/add/team/2" component={AddAwayTeam}/>
        <Route path="/scoreboard" component={Scoreboard}/>
        <Route path="*" component={NoApp}/>
      </Router>
    </Provider>
  </div>,
  document.getElementById('app')
);
