'use strict';
const superagent = require('superagent');
const util = require('util');

function MatchApi() {
	this.matchNumber = false;
	this.internalApi = '/api/matches/';
	return this;
}

MatchApi.prototype.update = function (match) {
	let apiMatchJsonObject;
	const _this = this;

	apiMatchJsonObject = formatRequestBody(match);

	superagent
        .put(this.internalApi + this.matchNumber)
        .send(apiMatchJsonObject)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
	if (err || !res.ok) {
		console.log('Oh no! error ' + JSON.stringify(res.body + ' ' + err));
	} else {
		const responds = JSON.parse(res.text);
		match.matchNumber = _this.matchNumber = responds.id;
	}
});
};

MatchApi.prototype.create = function (match, setMatchUrlState) {
	const apiMatchJsonObject = formatRequestBody(match);
	const _this = this;

	superagent
        .post(this.internalApi)
        .send(apiMatchJsonObject)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
	if (err || !res.ok) {
		console.log('Oh no! error ' + JSON.stringify(res.body + ' ' + err));
	} else {
		const responds = JSON.parse(res.text);
		match.matchNumber = _this.matchNumber = responds.id;
		setMatchUrlState(document.baseURI + '?match=' + responds.id);
	}
});
};

MatchApi.prototype.getMatch = function (id, setResultState) {
	superagent
        .get(this.internalApi + id)
        .end((err, res) => {
	if (err || !res.ok) {
		console.log('Oh no! error ' + JSON.stringify(res.body + ' ' + err));
		return;
	}
	const responds = JSON.parse(res.text);
	setResultState(responds.hometeam, responds.awayteam, responds.sets);
});
};

function formatRequestBody(match) {
	const homeTeam = match.homeTeam();
	const awayTeam = match.awayTeam();
	const sets = [];

	match.sets().forEach(set => {
		sets.push(set.score[0]);
		sets.push(set.score[1]);
	});

	return {
		hometeam: homeTeam.player1 + ' - ' + homeTeam.player2,
		awayteam: awayTeam.player1 + ' - ' + awayTeam.player2,
		sets
	};
}

module.exports = MatchApi;
