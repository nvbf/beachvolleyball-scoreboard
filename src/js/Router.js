import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

import { teamReducer } from './team/reducer';
import { TEAM } from './constants'

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
);

const reducer = combineReducers({
  [TEAM]: teamReducer,
  routing: routerReducer
});

const store = createStore(
  reducer,
  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()
);

const history = syncHistoryWithStore(browserHistory, store)

import AddHomeTeam from './team/AddHomeTeam';
import AddAwayTeam from './team/AddAwayTeam';
import Scoreboard from './scoreboard/Scoreboard';

const NoApp = () => {
  return (<div>Fant ikke noe her :/ </div>)
}
//TODO: Move PublicBoard to it's own app, see git history

ReactDom.render(
  <div>
     <Provider store={store}>
      <div>
        <Router history={history}>
          <Route path="/" component={AddHomeTeam} />
          <Route path="/add/team/2" component={AddAwayTeam}/>
          <Route path="/scoreboard.html" component={Scoreboard}/>
          <Route path="*" component={NoApp}/>
        </Router>
        { !window.devToolsExtension ? <DevTools /> : null }12
      </div>
    </Provider>
  </div>,
  document.getElementById('app')
);
