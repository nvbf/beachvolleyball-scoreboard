'use strict';

import React from  'react';
import url from 'url';

const AddHomeTeam = require('./AddHomeTeam');
const AddAwayTeam = require('./AddAwayTeam');
const Scoreboard = require('./Scoreboard');

const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Button = require('react-bootstrap').Button;

const MatchNotifications = require('./../domain/MatchNotifications');
const Match = require('./../domain/Match');
const MatchApi = require('./../domain/MatchApi');
const Team = require('./../domain/Team');

const match = new Match();
const matchApi = new MatchApi();

match.notification = new MatchNotifications(match, matchApi);

class Main extends React.Component {
  constructor(props) {
      super(props);
      this.state =  {
        show: 'AddHomeTeam',
        match: match.state,
        matchUrl: '',
        showTimeout: false,
        publicMatch: false
    };
  }

  changeState() {
    return function(state) {
      this.setState(
        state
      );
    }.bind(this);
  }

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
  }

  doMatchPublic(e) {
    e.preventDefault();
    this.setState({
      publicMatch: !this.state.publicMatch
    });
  }

  componentDidMount() {
    const qs = url.parse(document.location.search, true).query
    if(qs.name1 && qs.name2 && qs.name3 && qs.name4) {
        match.addHomeTeam(new Team(qs.name1, qs.name2));
        match.addAwayTeam(new Team(qs.name3, qs.name4));
        console.log('Setting show to Scoreboard');
        this.setState({show: 'Scoreboard'});
    }
  }

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
};

module.exports = Main;
