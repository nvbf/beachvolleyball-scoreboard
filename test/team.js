var assert = require("assert");
var Team = require("./../client/js/Team");

describe('Team Logic', function () {
    it('Add Players to team', function () {
        var team = new Team("Name1", "Name2");
        assert.equal(team.state.player1, "Name1");
        assert.equal(team.state.player2, "Name2");
    });

    it('players function', function () {
        var team = new Team("Name1", "Name2");
        assert.deepEqual(team.players(),
            {   player1: team.state.player1,
                player2: team.state.player2
            }
        );
    });

});