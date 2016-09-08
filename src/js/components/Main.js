'use strict';

const React = require('react');
const AddHomeTeam = require('./AddHomeTeam');
const AddAwayTeam = require('./AddAwayTeam');
const Scoreboard = require('./Scoreboard');

const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Button = require('react-bootstrap').Button;

const MatchNotifications = require('./../domain/MatchNotifications');
const Match = require('./../domain/Match');
const MatchApi = require('./../domain/MatchApi');

const match = new Match();
const matchApi = new MatchApi();

match.notification = new MatchNotifications(match, matchApi);

var Main = React.createClass({
  displayName() {
    return 'Main';
  },

  changeState() {
    return function(state) {
      this.setState(
        state
      );
    }.bind(this);
  },

  getInitialState() {
    return {
      show: 'AddHomeTeam',
      match: match.state,
      matchUrl: '',
      showTimeout: false,
      publicMatch: false
    };
  },

  showMatchUrl() {
    if (this.state.publicMatch) {
      var _this = this;
      if (!this.state.matchUrl) {
        matchApi.create(
          match,
          function(matchUrl) {
            _this.setState({matchUrl: matchUrl});
          }
        )
      }

      return (
        <p>
          {this.state.matchUrl}
        </p>
      );
    }
  },

  doMatchPublic(e) {
    e.preventDefault();
    this.setState({
      publicMatch: !this.state.publicMatch
    });
  },

  render() {

    var show = this.state.show;
    var changeState = this.changeState();

    if (show === 'AddHomeTeam') {
      return (
        <main>
          <AddHomeTeam changeState={changeState} match={match}/>
        </main>
      );
    } else if (show === 'AddAwayTeam') {
      return (
        <main>
          <AddAwayTeam changeState={changeState} match={match}/>
        </main>
      );
    } else {
      return (
        <section>
          <main>
            <Scoreboard match={match}/>
          </main>
        </section>
      );
    }
  }
});

module.exports = Main;
