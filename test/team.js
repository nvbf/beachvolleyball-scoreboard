var team = require("./../client/js/Team");

describe('Team Logic', function () {
    it('Add Players to team', function () {
        team.setPlayerNames("Name1", "Name2");
        assert.equal(team.state.player1, "Name1");
        assert.equal(team.state.player2, "Name2");
    });

});