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

  it('Set one should be 1-0, after we add point to hometeam', function() {
    var set = new Set(option);
    set.addPointHomeTeam();
    set.score.should.eql([1, 0]);
  });

  it('Set one should be 0-1, after we add point to awayteam', function() {
    var set = new Set(option);
    set.addPointAwayTeam();
    set.score.should.eql([0, 1]);
  });

});
