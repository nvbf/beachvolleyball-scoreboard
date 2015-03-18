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
  MenuItem = require('react-bootstrap/MenuItem'),
  match = new Match(),
  MatchNotifications = require('./../domain/MatchNotifications'),
  PublicBoard = require('./PublicBoard'),
  Main;

match.notification = new MatchNotifications(match);

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
      showTimeout: false
    }
  },

  showTimeout: function() {
    match.notification.emit('timeout-notification');
  },


  test: function(e) {
    console.log(e);
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
              <MenuItem href="#">
                <Input type="checkbox" label="Public" onchange={this.test} />
              </MenuItem>
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
