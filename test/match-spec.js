var should = require('should'),
  sinon = require('sinon'),
  Match = require(
    './../src/js/domain/Match'),
  Team = require('./../src/js/domain/Team'),
  matchTestUtil = require('./match-test-util');

describe('Match Logic', function() {

  it('Set one should be 1-0, after we add point to hometeam', function() {
    var match = new Match();
    match.addPointHomeTeam();
    match.getCurrentSetScore().should.eql([1, 0]);
  });

  it('Set one should be 0-1, after we add point to awayteam', function() {
    var match = new Match();
    match.addPointAwayTeam();
    match.getCurrentSetScore().should.eql([0, 1]);
  });

  it('Sould not return "switch", score is 0-1 ', function() {
    var match = new Match();
    match.addPointAwayTeam();
  });

  it('Sould return "switch" score will become 4-3', function() {
    var score = [[3, 3]],
      match = matchTestUtil.setScoreToTest(score),
      callback = sinon.spy(),
      switchObserver = function() {
        callback();
      };
    match.on('switch', switchObserver);
    match.addPointHomeTeam();
    callback.called.should.be.ok;
  });

  it('Adding Hometeam', function() {
    var match = new Match(),
      hometeam = new Team('player1', 'player2');
    match.addHomeTeam(hometeam);
    match.state.hometeam.should.eql(hometeam);
  });

  it('Adding Awayteam', function() {
    var match = new Match(),
      awayteam = new Team('player3', 'player4');
    match.addAwayTeam(awayteam);
    match.state.awayteam.should.eql(awayteam);
  });

});

describe('Test Match Util functions', function() {
  it('Setting state', function() {
    var score = [[19, 21], [23, 21], [13, 14]],
      match = matchTestUtil.setScoreToTest(score);

    match.state.currentSet.should.be.equal(2);
    match.state.currentSetScore.should.eql([13, 14]);
  });
});
