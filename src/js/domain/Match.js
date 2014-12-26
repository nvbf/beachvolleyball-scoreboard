'use strict';
var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  Team = require('./Team'),
  Set = require('./Set');

function Match() {
  var set1 = new Set()
  this.state = {
    hometeam: new Team('', ''),
    awayteam: new Team('', ''),
    sets: [set1, new Set(), new Set()],
    currentSet: 0,
    currentSetScore: set1.score
  };

  return this;
}

util.inherits(Match, EventEmitter);

Match.prototype.getCurrentSet = function() {
  return this.state.sets[this.state.currentSet]
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

Match.prototype.isFinished = function() {
  if (this.getCurrentSet().isSetWonByHomeTeam() || this.getCurrentSet().isSetWonByAwayTeam()) {
    this.state.currentSet++;
    this.state.currentSetScore = this.getCurrentSet().score;
    if (!this.matchFinished()) {
      this.emit('set-finished');
    }
    return true;
  }
  return false;
};

Match.prototype.matchFinished = function() {
  if (this.state.currentSet > 2) {
    this.emit('match-finished');
    return true;
  }
  if (this.state.currentSet > 2) {
    var set1 = this.state.sets[0],
      set2 = this.state.sets[1];

    if ((set1.isSetWonByAwayTeam() && set2.isSetWonByAwayTeam())
      || (set1.isSetWonByHomeTeam() && set2.isSetWonByHomeTeam())) {
      return true
    }
  }
  return false;
};

module.exports = Match;
