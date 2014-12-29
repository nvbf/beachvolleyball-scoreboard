'use strict';
var should = require('should'),
  sinon = require('sinon'),
  Set = require(
    './../src/js/domain/Set'),
  Team = require('./../src/js/domain/Team'),
  matchTestUtil = require('./match-test-util');

describe('Set Logic', function() {
  var option = {
    length: 21,
    switch: 7
  };

  it('Set should be 1-0, after we add point to hometeam', function() {
    var set = new Set(option);
    set.addPointHomeTeam();
    set.score.should.eql([1, 0]);
  });

  it('Set should be 0-1, after we add point to awayteam', function() {
    var set = new Set(option);
    set.addPointAwayTeam();
    set.score.should.eql([0, 1]);
  });

  it('should send notification on every ', function() {
    var set = new Set(option),
      notificationService = {};

    notificationService.emit = sinon.spy();

    set.notification = notificationService;
    set.score = [2, 3];
    set.addPointHomeTeam();

    notificationService.emit.calledWith('point-added');
    notificationService.emit.calledOnce;
    set.score.should.eql([3, 3]);

  });

  it('Set need to be win by 2 points', function() {
    var set = new Set(option);
    set.score = [20, 20];
    set.addPointHomeTeam();
    set.isSetWonByHomeTeam().should.not.be.ok;
  });

  it('Set need to be win by 2 points', function() {
    var set = new Set(option);
    set.score = [21, 20];
    set.addPointHomeTeam();
    set.isSetWonByHomeTeam().should.be.ok;
  });

  it('Awayteam could also win by 2 points', function() {
    var set = new Set(option);
    set.score = [20, 21];
    set.addPointAwayTeam();
    set.isSetWonByAwayTeam().should.be.ok;
  });

  it('Awayteam could also win by 2 points', function() {
    var set = new Set(option);
    set.score = [20, 21];
    set.addPointAwayTeam();
    set.isSetWonByAwayTeam().should.be.ok;
  });

  it('Should switch each 7 points ', function() {
    var set = new Set(option);
    set.score = [5, 2];
    set.shouldChangeSide().should.be.ok;
  });

  it('Should not switch on 5 points (option.switch = 7)', function() {
    var set = new Set(option);
    set.score = [1, 4];
    set.shouldChangeSide().should.not.be.ok;
  });

  it('Should not switch on 5 points (option.switch = 7)', function() {
    var set = new Set(option);
    set.score = [1, 4];
    set.shouldChangeSide().should.not.be.ok;
  });

  it('Set should be finished', function() {
    var set = new Set(option);
    set.score = [25, 23];
    set.isFinished().should.be.ok;
  });

  it('Set should not be finised', function() {
    var set = new Set(option);
    set.score = [17, 20];
    set.isFinished().should.be.not.ok;
  });

  it('Set is not started on', function() {
    var set = new Set(option);
    set.score = [0, 0];
    set.hasStarted().should.be.not.be.ok;
  });

  it('Set is not started on', function() {
    var set = new Set(option);
    set.score = [1, 0];
    set.hasStarted().should.be.ok;
  });
});
