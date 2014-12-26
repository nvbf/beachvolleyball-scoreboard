'use strict';
var should = require('should'),
  sinon = require('sinon'),
  Set = require(
    './../src/js/domain/Set'),
  Team = require('./../src/js/domain/Team'),
  matchTestUtil = require('./match-test-util');

describe('Set Logic', function() {

  it('Set one should be 1-0, after we add point to hometeam', function() {
    var set = new Set();
    set.addPointHomeTeam();
    set.score.should.eql([1, 0]);
  });

  it('Set one should be 0-1, after we add point to awayteam', function() {
    var set = new Set();
    set.addPointAwayTeam();
    set.score.should.eql([0, 1]);
  });

  it('Sould not return "switch", score is 0-1 ', function() {
    var set = new Set(),
      callback = sinon.spy(),
      switchObserver = function() {
        callback();
      };
    set.on('switch', switchObserver);
    set.addPointAwayTeam();
    callback.called.should.not.be.ok;
  });

  it('Sould return "switch" score will become 4-3', function() {
    var set = new Set(),
      callback = sinon.spy(),
      switchObserver = function() {
        callback();
      };

    set.score = [3, 3];
    set.on('switch', switchObserver);
    set.addPointHomeTeam();
    callback.notCalled.should.be.ok;
  });

});

