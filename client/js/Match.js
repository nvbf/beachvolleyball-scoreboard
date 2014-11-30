function Match() {
    this.state = {
        hometeam: undefined,
        awayteam: undefined,
        sets: [[0, 0], [0, 0], [0, 0]],
        currentSet: 0
    };
    return this;
}

Match.prototype.getCurrentSet = function () {
    return this.state.sets[this.state.currentSet];
};

Match.prototype.updatePoints = function (setScore) {
    this.state.sets[this.state.currentSet] = setScore;
};


Match.prototype.addPointHomeTeam = function (eventHandler) {
    return this.addPoint(eventHandler, 0);
};

Match.prototype.changeSide = function () {
    var set = this.getCurrentSet();
    return (0 === (set[0] + set[1]) % 7);
};


Match.prototype.addPointAwayTeam = function (eventHandler) {
    return this.addPoint(eventHandler, 1);
};

Match.prototype.addPoint = function (eventHandler, team) {
    var set = this.getCurrentSet();
    set[team]++;
    this.updatePoints(set);
    if (this.changeSide(set)) {
        eventHandler("switch");
    }
};

Match.prototype.hometeam = function (team) {
    this.state.hometeam = team;
};

Match.prototype.awayteam = function (team) {
    this.state.awayteam = team;
};


module.exports = new Match();