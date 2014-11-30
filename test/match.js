var assert = require("assert");
var Match = require("./../client/js/Match");
var Team = require("./../client/js/Team");
var match = new Match();
var eventHandler = require("./matchEventHandlerMock");

describe('Match Logic', function () {
        it('Set one should be 1-0, after we add point to hometeam', function () {
            match.addPointHomeTeam(eventHandler);
            assert.deepEqual([1,0], match.getCurrentSet());
        });

        it('Set one should be 1-1, after we add point to hometeam', function () {
            match.addPointAwayTeam(eventHandler);
            assert.deepEqual([1,1], match.getCurrentSet());
        });

        it('Sould not return "switch", score is 1-2 ', function () {
            var triggerEvent;
            match.addPointAwayTeam(
                function(eventTrigger) {
                    triggerEvent = eventHandler(eventTrigger);
                });
            assert.equal(triggerEvent, undefined)
        });

    it('Sould return "switch" score will become 4-3', function () {
        match.addPointAwayTeam(eventHandler);
        match.addPointHomeTeam(eventHandler);
        match.addPointHomeTeam(eventHandler);
        var triggerEvent;
        match.addPointHomeTeam(
            function(eventTrigger) {
                triggerEvent = eventHandler(eventTrigger);
            });
        assert.equal(triggerEvent, "switch")
    });

    it('Adding Hometeam', function () {
        var  hometeam = new Team('player1', 'player2');
        match.hometeam(hometeam);
        assert.deepEqual(match.state.hometeam, hometeam);
    });

    it('Adding Awayteam', function () {
        var awayteam = new Team('player3', 'player4');
        match.awayteam(awayteam);
        assert.deepEqual(match.state.awayteam, awayteam);
    });

});
