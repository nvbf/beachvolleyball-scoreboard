'use strict';
var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  Team = require('./Team');

function Match() {
  this.state = {
    hometeam: new Team('', ''),
    awayteam: new Team('', ''),
    sets: [[0, 0], [0, 0], [0, 0]],
    currentSet: 0,
    currentSetScore: [0, 0]
  };
  return this;
}

util.inherits(Match, EventEmitter);

Match.prototype.getCurrentSetScore = function() {
  return this.state.sets[this.state.currentSet];
};

Match.prototype.updatePoints = function(setScore) {
  this.state.sets[this.state.currentSet] = setScore;
  this.state.currentSetScore = this.getCurrentSetScore()
};

Match.prototype.addPointHomeTeam = function() {
  return this.addPoint(0);
};

Match.prototype.addPointAwayTeam = function() {
  return this.addPoint(1);
};

Match.prototype.addPoint = function(teamIndex) {
  var set = this.getCurrentSetScore();
  set[teamIndex]++;
  this.updatePoints(set);

  //Trigger event if due
  if (!this.setFinished()) {
    this.changeSide();
  }
};

Match.prototype.changeSide = function() {
  var set = this.getCurrentSetScore();

  // every 7 point
  if ((set[0] + set[1]) % 7 === 0) {
    this.emit('switch');
    return true;
  }
  return false;
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

Match.prototype.isSetWonByHomeTeam = function() {
  var setScore = this.getCurrentSetScore(),
    setNumber = this.set;
  if (setNumber === 2) {
    return (setScore[0] >= 15 && setScore[0] > setScore[1] + 1)
  } else {
    return (setScore[0] >= 21 && setScore[0] > setScore[1] + 1)
  }
};

Match.prototype.isSetWonByAwayTeam = function() {
  var setScore = this.getCurrentSetScore(),
    setNumber = this.currentSet;
  if (setNumber === 2) {
    return (setScore[1] >= 15 && setScore[1] > setScore[0] + 1)
  } else {
    return (setScore[1] >= 21 && setScore[1] > setScore[0] + 1)
  }

};

Match.prototype.setFinished = function() {
  if (this.isSetWonByHomeTeam() || this.isSetWonByAwayTeam()) {
    this.state.currentSet++;
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
  if (this.state.currentSet > 1) {
    var readTodo =  this.state.currentSet;
    //TODO: Match can also be win 2-0, need to support that :)
    //this.getSet();
  }
  return false;
};

//starts at 0
Match.prototype.getSet = function(setNumberFromZero) {
  return this.state.sets[setNumberFromZero];
};

module.exports = Match;
