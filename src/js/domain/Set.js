'use strict';
var util = require('util'),
  EventEmitter = require('events').EventEmitter;

function Set(limit) {
  this.score = [0, 0];
  this.pointLimit = limit;

  this.addPoint = function(teamIndex) {
    this.score[teamIndex]++;
  };

  this.changeSide = function() {
    var score = this.score;

    // every 7 point
    if ((score[0] + score[1]) % 7 === 0) {
      this.emit('switch');
      return true;
    }
    return false;
  };

  return this;
}

util.inherits(Set, EventEmitter);

Set.prototype.addPointHomeTeam = function() {
  return this.addPoint(0);
};

Set.prototype.addPointAwayTeam = function() {
  return this.addPoint(1);
};

Set.prototype.isSetWonByHomeTeam = function() {
  var score = this.score;
  return (score[0] >= this.pointLimit && score[0] > score[1] + 1)
};

Set.prototype.isSetWonByAwayTeam = function() {
  var score = this.score;
  return (score[1] >= this.pointLimit && score[1] > score[0] + 1)
};

Set.prototype.isFinished = function() {
  return (this.isSetWonByHomeTeam() || this.isSetWonByAwayTeam())
};

module.exports = Set;
