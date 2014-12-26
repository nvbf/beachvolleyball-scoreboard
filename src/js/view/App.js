/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Match = require('./../domain/Match'),
  AddHomeTeam = require('./AddHomeTeam'),
  AddAwayTeam = require('./AddAwayTeam'),
  Scoreboard = require('./Scoreboard'),
  match = new Match(),
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
        return <AddHomeTeam changeState={changeState} match={match} />;
      }
      else if (show === 'AddAwayTeam') {
        return <AddAwayTeam changeState={changeState} match={match} />;
      }
      else {
        return <Scoreboard match={match} />
      }
    }
  });

window.React = React;

React.render(<App />, document.body);
