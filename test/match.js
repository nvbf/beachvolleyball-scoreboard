const should = require('should');
const sinon = require('sinon');
const Match = require('./../src/js/domain/Match');
const Set = require('./../src/js/domain/Set');
const Team = require('./../src/js/domain/Team');
const matchTestUtil = require('./match-test-util');

describe('Match Logic', function() {

  it('Adding Hometeam', function() {
    var match = new Match();
    var hometeam = new Team('player1', 'player2');
    match.addHomeTeam(hometeam);
    match.state.hometeam.should.eql(hometeam);
  });

  it('Adding Awayteam', function() {
    var match = new Match();
    var awayteam = new Team('player3', 'player4');
    match.addAwayTeam(awayteam);
    match.state.awayteam.should.eql(awayteam);
  });

});

describe('Test Match Util functions', function() {
  var option = {
    length: 21,
    switch: 7
  };

  it('Setting state', function() {
    var match;
    var score = [new Set(option), new Set(option), new Set(option)];
    score[0] = [19, 21];
    score[1] = [23, 21];
    score[2] = [13, 14];
    match = matchTestUtil.setScoreToTest(score);
    match.state.currentSet.should.be.equal(2);
    match.state.currentSetScore.should.eql([13, 14]);
  });
});
