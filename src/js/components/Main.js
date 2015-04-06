'use strict';

const React = require('react');
const Match = require('./../domain/Match');
const AddHomeTeam = require('./AddHomeTeam');
const AddAwayTeam = require('./AddAwayTeam');
const Scoreboard = require('./Scoreboard');
const Navbar = require('react-bootstrap/Navbar');
const Nav = require('react-bootstrap/Nav');
const DropdownButton = require('react-bootstrap/DropdownButton');
const MenuItem = require('react-bootstrap/MenuItem');
const MatchNotifications = require('./../domain/MatchNotifications');
const MatchApi = require('./../domain/MatchApi');
const match = new Match();
const matchApi = new MatchApi();

match.notification = new MatchNotifications(match, matchApi);

var Main = React.createClass({
  displayName: function() {
    return 'Main';
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
      match: match.state,
      matchUrl: '',
      showTimeout: false,
      publicMatch: false
    };
  },

  showTimeout: function() {
    match.notification.emit('timeout-notification');
  },

  timeoutHomeTeam: function() {
    let set = match.getCurrentSet();
    set.homeTeamTakesTimeout();
    this.showTimeout();
  },

  timeoutAwayTeam: function() {
    let set = match.getCurrentSet();
    set.awayTeamTakesTimeout();
    this.showTimeout();
  },

  showHomeTeamAsDisabled() {
    let set = match.getCurrentSet();
    if (set.canHomeTeamTakeTimeout()) {
      return '';
    }
    return 'disabled';
  },

  showAwayTeamAsDisabled() {
    let set = match.getCurrentSet();
    if (set.canAwayTeamTakeTimeout()) {
      return '';
    }
    return 'disabled';
  },

  showMatchUrl: function() {
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
        <MenuItem>
          {this.state.matchUrl}
        </MenuItem>
      );
    } else {
      return;
    }
  },

  doMatchPublic: function() {
    this.setState({
      publicMatch: !this.state.publicMatch
    });
  },

  render: function() {

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
          <Navbar>
            <Nav>
              <DropdownButton title="Timeout">
                <MenuItem className={this.showHomeTeamAsDisabled()} onSelect={this.timeoutHomeTeam}>{match.state.hometeam.display()}</MenuItem>
                <MenuItem className={this.showAwayTeamAsDisabled()} onSelect={this.timeoutAwayTeam}>{match.state.awayteam.display()}</MenuItem>
              </DropdownButton>
              <MenuItem onSelect={this.doMatchPublic} ref="public">
                Public
              </MenuItem>
              {this.showMatchUrl()}
            </Nav>
          </Navbar>
          <main>
            <Scoreboard match={match}/>
          </main>
        </section>
      );
    }
  }
});

module.exports = Main;
