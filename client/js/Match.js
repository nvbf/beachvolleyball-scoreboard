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

Match.prototype.getCurrentSetScore = function () {
    return this.state.sets[this.state.currentSet];
};

Match.prototype.updatePoints = function (setScore) {
    this.state.sets[this.state.currentSet] = setScore;
    this.state.currentSetScore = this.getCurrentSetScore()
};

Match.prototype.addPointHomeTeam = function () {
    return this.addPoint(0);
};

Match.prototype.addPointAwayTeam = function () {
    return this.addPoint(1);
};

Match.prototype.addPoint = function (teamIndex) {
    var set = this.getCurrentSetScore();
    set[teamIndex]++;
    this.updatePoints(set);

    //Trigger event if due
    this.changeSide();
    this.setFinished();
};


Match.prototype.changeSide = function () {
    var set = this.getCurrentSetScore();

    // every 7 point
    if (0 === (set[0] + set[1]) % 7) {
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

Match.prototype.isSetWonByHomeTeam = function () {
    var setScore = this.getCurrentSetScore();
    var setNumber = this.set;
    if (setNumber === 2) {
        return (setScore[0] >= 15 && setScore[0] > setScore[1] + 1)
    } else {
        return (setScore[0] >= 21 && setScore[0] > setScore[1] + 1)
    }
};

Match.prototype.isSetWonByAwayTeam = function () {
    var setScore = this.getCurrentSetScore();
    var setNumber = this.currentSet;
    if (setNumber === 2) {
        return (setScore[0] >= 15 && setScore[0] > setScore[1] + 1)
    } else {
        return (setScore[0] >= 21 && setScore[0] > setScore[1] + 1)
    }

};


Match.prototype.setFinished = function () {
    if (this.isSetWonByHomeTeam() || this.isSetWonByAwayTeam()) {
        this.state.currentSet++;
        this.emit("setFinished");
    }
    this.matchFinished();
};

Match.prototype.matchFinished = function () {
    if (this.state.currentSet > 2) {

    }
    if (this.state.currentSet > 1) {
        this.getSet();
    }
};

//starts at 0
Match.prototype.getSet = function (setNumberFromZero) {
    return this.state.sets[setNumberFromZero];
};


module.exports = Match;