var util = require('util');
var EventEmitter = require('events').EventEmitter;


function Match() {
    this.state = {
        hometeam: undefined,
        awayteam: undefined,
        sets: [[0, 0], [0, 0], [0, 0]],
        currentSet: 0,
        currentSetScore: {
            home: 0,
            away: 0
        }
    };
    return this;
}

util.inherits(Match, EventEmitter);

Match.prototype.getCurrentSet = function () {
    return this.state.sets[this.state.currentSet];
};

Match.prototype.updatePoints = function (setScore) {
    this.state.sets[this.state.currentSet] = setScore;
    this.state.currentSetScore = {
        home: this.getCurrentSet()[0],
        away: this.getCurrentSet()[1]
    }
};

Match.prototype.addPointHomeTeam = function () {
    return this.addPoint(0);
};

Match.prototype.changeSide = function () {
    var set = this.getCurrentSet();
    return (0 === (set[0] + set[1]) % 7);
};


Match.prototype.addPointAwayTeam = function () {
    return this.addPoint(1);
};

Match.prototype.addPoint = function (team) {
    var set = this.getCurrentSet();
    set[team]++;
    this.updatePoints(set);
    if(this.changeSide()) {
        this.emit("switch");
    }
};

Match.prototype.addHomeTeam = function (team) {
    this.state.hometeam = team;
};

Match.prototype.homeTeam = function () {
    return this.state.hometeam.players();
};

Match.prototype.addAwayTeam = function (team) {
    this.state.awayteam = team;
};

Match.prototype.awayTeam = function () {
    return this.state.awayteam.players();
};


module.exports = Match;