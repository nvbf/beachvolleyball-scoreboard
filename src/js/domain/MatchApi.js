'use strict';
var superagent = require('superagent');

function MatchApi() {
    this.matchNumber = false;
    this.apiUrl = 'https://scoreboard-api-sindresvendby.c9.io/api/matches/';
    return this;
}

MatchApi.prototype.update = function(match) {

    var apiMatchJsonObject,
        _this = this;

    apiMatchJsonObject = formatRequestBody(match);

    superagent
        .put(this.apiUrl + this.matchNumber)
        .send(apiMatchJsonObject)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            if (err || !res.ok) {
                console.log('Oh no! error ' + JSON.stringify(res.body + ' ' + err));
            }
            else {
                match.matchNumber = _this.matchNumber = res.body.id;
            }
        });
};

MatchApi.prototype.create = function(match, setMatchUrlState) {

    var apiMatchJsonObject = formatRequestBody(match),
        _this = this;

    superagent
        .post(this.apiUrl)
        .send(apiMatchJsonObject)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            if (err || !res.ok) {
                console.log('Oh no! error ' + JSON.stringify(res.body + ' ' + err));
            }
            else {
                match.matchNumber = _this.matchNumber = res.body.id;
                setMatchUrlState(document.baseURI + '?match=' + res.body.id);
            }
        });
};

MatchApi.prototype.getMatch = function(id, setResultState) {
    superagent
        .get(this.apiUrl + id)
        .end(function(err, res) {
            if (err || !res.ok) {
                console.log('Oh no! error ' + JSON.stringify(res.body + ' ' + err));
                return;
            }
            else {
                setResultState(res.body.hometeam, res.body.awayteam, res.body.sets);
            }
        });
};


function formatRequestBody(match) {
    var homeTeam = match.homeTeam(),
        awayTeam = match.awayTeam(),
        sets = [];

    match.sets().forEach(function(set) {
        sets.push(set.score[0]);
        sets.push(set.score[1]);
    });

    return {
        "hometeam": homeTeam.player1 + " - " + homeTeam.player2,
        "awayteam": awayTeam.player1 + " - " + awayTeam.player2,
        "sets": sets
    };
}

module.exports = MatchApi;
