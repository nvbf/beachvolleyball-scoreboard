jest.dontMock('./../client/js/Match');
jest.dontMock('events');
jest.dontMock('util');

var Match = require("./../client/js/Match");
var Team = require("./../client/js/Team");
var eventHandler = require("./matchEventHandlerMock");

describe('Match Logic', function () {

    it('Set one should be 1-0, after we add point to hometeam', function () {
        var match = new Match();
        match.addPointHomeTeam();
        expect(match.getCurrentSetScore()).toEqual([1, 0]);
    });

    it('Set one should be 1-1, after we add point to hometeam', function () {
        var match = new Match();
        match.addPointHomeTeam();
        match.addPointAwayTeam();
        expect(match.getCurrentSetScore()).toEqual([1, 1]);
    });

    it('Sould not return "switch", score is 0-1 ', function () {
        var triggerEvent;
        var match = new Match();
        match.addPointAwayTeam();
    });

    it('Sould return "switch" score will become 4-3', function () {
        var match = new Match();

        var switchObserver = function () {
            expect(true).toBe(true);
        };

        match.on('switch', switchObserver);

        match.addPointAwayTeam();
        match.addPointAwayTeam();
        match.addPointAwayTeam();
        match.addPointHomeTeam();
        match.addPointHomeTeam();
        match.addPointHomeTeam();
        match.addPointHomeTeam();
    });

    it('Adding Hometeam', function () {
        var match = new Match();
        var hometeam = new Team('player1', 'player2');
        match.addHomeTeam(hometeam);
        expect(match.state.hometeam).toBe(hometeam);
    });

    it('Adding Awayteam', function () {
        var match = new Match();
        var awayteam = new Team('player3', 'player4');
        match.addAwayTeam(awayteam);
        expect(match.state.awayteam).toBe(awayteam);
    });

});
