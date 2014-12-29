'use strict';

function Set(option) {
  this.score = [0, 0];
  this.pointLimit = option.length;
  this.switch = option.switch;
  this.servingOrder;

  this.addPoint = function(teamIndex) {
    this.score[teamIndex]++;
    if (this.notification) {
      this.notification.emit('point-added');
    }
  };

  this.notifyServerOrder = function(team) {
    if (this.teamCurrentlyServing !== team && this.notification) {
      this.notification.emit('switch-server');
    }
  };

  return this;
}

Set.prototype.setStartServing = function(team) {
  this.teamCurrentlyServing = team;
};

Set.prototype.shouldChangeSide = function() {
  var score = this.score;
  // true every 7 point
  return ((score[0] + score[1]) % this.switch === 0);
};

Set.prototype.addPointHomeTeam = function() {
  this.notifyServerOrder('hometeam');
  this.teamCurrentlyServing = 'hometeam';
  return this.addPoint(0);
};

Set.prototype.addPointAwayTeam = function() {
  this.notifyServerOrder('awayteam');
  this.teamCurrentlyServing = 'awayteam';
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

Set.prototype.hasStarted = function() {
  return !(this.score[0] === 0 && this.score[1] === 0);
};

module.exports = Set;
