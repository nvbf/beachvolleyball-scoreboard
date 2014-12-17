'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;


function Match() {
    this.state = {
        hometeam: undefined,
        awayteam: undefined,
        sets: [[0, 0], [0, 0], [0, 0]],
        currentSet: 0,
        currentSetScore: [0, 0]
    };
    return this;
}

util.inherits(Match, EventEmitter);

Match.prototype.getCurrentSet = function () {
    return this.state.sets[this.state.currentSet];
};

Match.prototype.updatePoints = function (setScore) {
    this.state.sets[this.state.currentSet] = setScore;
    this.state.currentSetScore = this.getCurrentSet()
};

Match.prototype.addPointHomeTeam = function () {
    return this.addPoint(0);
};

Match.prototype.changeSide = function () {
    var set = this.getCurrentSet();

    // every 7 point
    if (0 === (set[0] + set[1]) % 7) {
        this.emit("switch");
    }
};


Match.prototype.addPointAwayTeam = function () {
    return this.addPoint(1);
};

Match.prototype.addPoint = function (team) {
    var set = this.getCurrentSet();
    set[team]++;
    this.updatePoints(set);

    //Trigger event if due
    this.changeSide();
    this.setFinished();
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

Match.prototype.isSetWonByHomeTeam = function (setScore) {
    return (setScore[0] >= 21 && setScore[0] > setScore[1] + 1)
};

Match.prototype.isSetWonByAwayTeam = function (setScore) {
    return (setScore[1] >= 21 && setScore[1] > setScore[0] + 1);
};


Match.prototype.setFinished = function () {
    var score = this.state.currentSetScore;
    if (this.isSetWonByHomeTeam(score) || this.isSetWonByAwayTeam(score)) {
        this.emit("setFinished");
    }
    this.state.currentSet++;
    this.matchFinished();
};

Match.prototype.matchFinished = function () {
    if (this.state.currentSet > 1) {
        this.getSet();
    }
};

//starts at 0
Match.prototype.getSet = function (setNumberFromZero) {
    return this.state.sets[setNumberFromZero];
};


module.exports = Match;