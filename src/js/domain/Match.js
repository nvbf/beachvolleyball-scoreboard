const util = require('util');
const EventEmitter = require('events').EventEmitter;
const Team = require('./Team');
const Set = require('./Set');
const MatchNotifications = require('./MatchNotifications');

function Match() {
  var defaultSetOption = {
    length: 21,
    switch: 7,
    tto: 21
  };
  var thirdSetOption = {
    length: 15,
    switch: 5
  };
  var set1 = new Set(defaultSetOption);

  this.state = {
    hometeam: new Team('', ''),
    awayteam: new Team('', ''),
    sets: [set1, new Set(defaultSetOption), new Set(thirdSetOption)],
    currentSet: 0,
    currentSetScore: set1.score,
    finished: false
  };

  return this;
}

util.inherits(Match, EventEmitter);

Match.prototype.notification = undefined;

Match.prototype.getCurrentSet = function() {
  return this.state.sets[this.state.currentSet];
};

Match.prototype.nextSet = function() {
  this.state.currentSet++;
  this.currentSetScore = this.getCurrentSet().scoreForThisTeam;
};

Match.prototype.setPrivateState = function(state) {
  this.state = state;
};

Match.prototype.addHomeTeam = function(team) {
  this.state.hometeam = team;
};

Match.prototype.homeTeam = function() {
  return this.state.hometeam.players();
};

Match.prototype.addAwayTeam = function(team) {
  this.state.awayteam = team;
};

Match.prototype.awayTeam = function() {
  return this.state.awayteam.players();
};

Match.prototype.sets = function() {
  return this.state.sets;
};

module.exports = Match;
