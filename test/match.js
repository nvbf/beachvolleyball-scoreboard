var assert = require("assert");
var match = require("./../client/js/Match");
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
});
