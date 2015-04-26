'use strict';

const React = require('react');
const AddHomeTeam = require('./AddHomeTeam');
const AddAwayTeam = require('./AddAwayTeam');
const Scoreboard = require('./Scoreboard');

const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Navbar = require('react-bootstrap').Navbar;
const Button = require('react-bootstrap').Button;
const Nav = require('react-bootstrap').Nav;

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

  handleCopy() {
    window.alert('sorry not implmented yet');
  },

  renderPublicComponent() {
    if (!this.state.publicMatch) {
      return (
        <ButtonToolbar>
          <Button bsStyle='success' onClick={this.doMatchPublic} ref="public">
            Make this match public
          </Button>
        </ButtonToolbar>
      );
    } else {
      return (
        <div>
          {this.showMatchUrl()}
          <Button onClick={this.handleCopy}> Copy to clipboard </Button>
        </div>
      )
    }
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
          <Navbar>
            <Nav>
              {this.renderPublicComponent()}
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
