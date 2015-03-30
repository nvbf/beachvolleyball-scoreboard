/** @jsx React.DOM  */
'use strict';

const React = require('react');
const Match = require('./../domain/Match');
const AddHomeTeam = require('./AddHomeTeam');
const AddAwayTeam = require('./AddAwayTeam');
const Scoreboard = require('./Scoreboard');
const Navbar = require('react-bootstrap/Navbar');
const Input = require('react-bootstrap/Input');
const Nav = require('react-bootstrap/Nav');
const Button = require('react-bootstrap/Button');
const MenuItem = require('react-bootstrap/MenuItem');
const MatchNotifications = require('./../domain/MatchNotifications');
const MatchApi = require('./../domain/MatchApi');
const PublicBoard = require('./PublicBoard');
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
              <MenuItem onSelect={this.showTimeout}>Timeout</MenuItem>
              <MenuItem href="#">Logg inn</MenuItem>
              <MenuItem onSelect={this.doMatchPublic}>
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