var should = require('should'),
  sinon = require('sinon'),
  MatchNotifications = require('./../src/js/domain/MatchNotifications'),
  Match = require('./../src/js/domain/Match');

describe('match-notifications', function() {

  it('Send notfication about that the match is done in the third set', function() {
    var match = new Match(),
      notificationService = {};

    notificationService.emit = sinon.spy();

    set.notification = notificationService;
    set.score = [2, 3];
    set.addPointHomeTeam();

    notificationService.emit.calledWith('point-added');
    notificationService.emit.calledOnce;
    set.score.should.eql([3, 3]);

  });
});
