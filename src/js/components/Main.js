/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  Match = require('./../domain/Match'),
  AddHomeTeam = require('./AddHomeTeam'),
  AddAwayTeam = require('./AddAwayTeam'),
  Scoreboard = require('./Scoreboard'),
  Navbar = require('react-bootstrap/Navbar'),
  Input = require('react-bootstrap/Input'),
  Nav = require('react-bootstrap/Nav'),
  Button = require('react-bootstrap/Button'),
  MenuItem = require('react-bootstrap/MenuItem'),
  MatchNotifications = require('./../domain/MatchNotifications'),
  MatchApi = require('./../domain/MatchApi'),
  PublicBoard = require('./PublicBoard'),
  match = new Match(),
  matchApi = new MatchApi(),
  Main;

match.notification = new MatchNotifications(match, matchApi);

Main = React.createClass({
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

  
  showMatchUrl:  function() {
    if(this.state.publicMatch) {
      var _this = this;
      if(!this.state.matchUrl) {
        matchApi.create(
          match, 
          function(matchUrl) {
            _this.setState( { 'matchUrl': matchUrl });
          }
      )}
      
      
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
      publicMatch : !this.state.publicMatch
    });
  },
  
  render: function() {
    
    var show = this.state.show,
      changeState = this.changeState();

    if (show === 'AddHomeTeam') {
      return (
        <main>
          <AddHomeTeam changeState={changeState} match={match} />
        </main>
      );
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
