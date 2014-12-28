var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  Team = require('./Team'),
  Set = require('./Set'),
  Match = require('./Match');

function MatchNotifications() {
  this.match = match;

  var sets = this.match.state.sets;

  sets.map(function(set) {
    set.notification = this;
  });

  this.on('point-added', this.notify);

  return this;
}

MatchNotifications.prototype.notify = function() {
  var match = this.match,
    set1 = match.state.sets[0],
    set2 = match.state.sets[1];

  if (match.getCurrentSet().isFinished()) {
    if (match.state.currentSet == 2) {
      return this.emit('match-notification');
    }

    if (match.state.currentSet === 1) {
      if ((set1.isSetWonByAwayTeam() && set2.isSetWonByAwayTeam())
        || (set1.isSetWonByHomeTeam() && set2.isSetWonByHomeTeam())) {
        return this.emit('match-notification');
      }
    }
    match.nextSet();
    return this.emit('set-notification');
  }
  if (match.getCurrentSet().shouldChangeSide()) {
    return this.emit('switch-notification');
  }
};

util.inherits(MatchNotifications, EventEmitter);

module.exports = MatchNotifications;
