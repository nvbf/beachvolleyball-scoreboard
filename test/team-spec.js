
var Team = require('./../src/js/Team');

describe('Team Logic', function() {
  it('Add Players to team', function() {
    var team = new Team('Name1', 'Name2');
    expect(team.state.player1).toBe('Name1');
    expect(team.state.player2).toBe('Name2');
  });

  it('players function', function() {
    var team = new Team('Name1', 'Name2'),
      expectedResult = {
        player1: team.state.player1,
        player2: team.state.player2
      };
    expect(team.players()).toEqual(
      expectedResult
    );
  });
});
