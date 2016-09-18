'use strict';

function Set(option) {
  this.score = [0, 0];
  this.pointLimit = option.length;
  this.switch = option.switch;
  this.tto = option.tto;
  this.timeoutLimit = option.timeoutLimit;
  this.timeout = {
    homeTeam: 0,
    awayTeam: 0
  };
  this.teamCurrentlyServingHistory = []

  this.addPoint = function(teamIndex) {
    this.score[teamIndex]++;
    if (this.notification) {
      this.notification.emit('point-added');
    }
  };

  this.removePoint = function(teamIndex) {
    this.score[teamIndex]--;
    if (this.notification) {
      this.notification.emit('point-remove');
    }
    this.notifyServerOrderReverse()
  };

  this.notifyServerOrder = function(team) {
    this.teamCurrentlyServingHistory.push(team);
    if (this.teamCurrentlyServing !== team && this.notification) {
      this.notification.emit('switch-server');
    }
  };

  this.notifyServerOrderReverse = function() {
    var team =  this.teamCurrentlyServingHistory.pop(team);
    if (team && this.teamCurrentlyServing !== team && this.notification) {
      this.notification.emit('switch-server-reverse');
    }
  };

  return this;
}

Set.prototype.setStartServing = function(team) {
  this.teamCurrentlyServing = team;
};

Set.prototype.isTTO = function() {
  if (!this.tto) {
    return false;
  }

  var score = this.score;
  return ((score[0] + score[1]) === this.tto);

};

Set.prototype.shouldChangeSide = function() {
  var score = this.score;
  // true every 7 point
  return ((score[0] + score[1]) % this.switch === 0);
};

Set.prototype.removePointHomeTeam = function() {
  return this.removePoint(0);
};

Set.prototype.addPointHomeTeam = function() {
  this.notifyServerOrder('hometeam');
  this.teamCurrentlyServing = 'hometeam';
  return this.addPoint(0);
};

Set.prototype.removePointAwayTeam = function() {
  return this.removePoint(1);
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
