/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Match = require('./../domain/Match'),
  AddHomeTeam = require('./AddHomeTeam'),
  AddAwayTeam = require('./AddAwayTeam'),
  Scoreboard = require('./Scoreboard'),
  MatchNotifications = require('./../domain/MatchNotifications'),
  Menu = require('./Menu'),
  match = new Match(),
  matchNotifications = new MatchNotifications(match),
  App;

App = React.createClass({
  displayName: function() {
    return 'App';
  },

  changeState: function() {
    return function(state) {
      this.setState(
        state
      );
    }.bind(this);
  },

  getInitialState: function() {
    return {
      show: 'AddHomeTeam',
      match: match.state
    }
  },

  render: function() {
    var show = this.state.show,
      changeState = this.changeState();

    if (show === 'AddHomeTeam') {
      return (
        <main>
          <AddHomeTeam changeState={changeState} match={match} />
        </main>
      )
    }
    else if (show === 'AddAwayTeam') {
      return (
        <main>
          <AddAwayTeam changeState={changeState} match={match} />
        </main>
      );
    }
    else {
      return (
        <section>
          <Menu />
          <main>
            <Scoreboard match={match} notification={matchNotifications} />
          </main>
        </section>
      )
    }
  }
});

window.React = React;

React.render(<App />, document.body);
