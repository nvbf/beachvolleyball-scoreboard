var util = {},
  Match = require(
    './../src/js/domain/Match'),
  Team = require('./../src/js/domain/Team');

util.setScoreToTest = function(score) {
  var match = new Match(),
    state = {
      hometeam: new Team('Player1', 'Player2'),
      awayteam: new Team('Player3', 'Player4'),
      sets: score,
      currentSet: score.length - 1,
      currentSetScore: score[score.length - 1].scoreForThisTeam
    };

  match.setPrivateState(state);
  return match;
};

module.exports = util;
