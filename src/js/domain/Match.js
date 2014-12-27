'use strict';
var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  Team = require('./Team'),
  Set = require('./Set');

function Match() {
  var defaultSetOption = {
    lenght: 21,
    switch: 7
    },
  thirdSetOption = {
    lenght: 15,
    switch: 5
  },

  set1 = new Set(defaultSetOption);
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

Match.prototype.getCurrentSet = function() {
  return this.state.sets[this.state.currentSet]
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

module.exports = Match;
