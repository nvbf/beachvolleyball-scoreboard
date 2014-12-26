var should = require('should'),
  Team = require('./../src/js/domain/Team');

describe('Team Logic', function() {
  it('Add Players to team', function() {
    var team = new Team('Name1', 'Name2');
    team.state.player1.should.equal('Name1');
    team.state.player2.should.equal('Name2');
  });

  it('players function', function() {
    var team = new Team('Name1', 'Name2'),
      expectedResult = {
        player1: team.state.player1,
        player2: team.state.player2
      };
    team.players().should.containEql(expectedResult);
  });
});
