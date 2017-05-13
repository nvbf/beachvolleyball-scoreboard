const util = require('util');
import {EventEmitter} from 'events';
import Team from './team';
import Sett from './sett';

function Match() {
	const defaultSetOption = {
		length: 21,
		switch: 7,
		tto: 21,
		timeoutLimit: 1
	};
	const thirdSetOption = {
		length: 15,
		switch: 5
	};
	const set1 = new Sett(defaultSetOption);

	this.state = {
		hometeam: new Team('', ''),
		awayteam: new Team('', ''),
		sets: [set1, new Sett(defaultSetOption), new Sett(thirdSetOption)],
		currentSet: 0,
		currentSetScore: set1.score,
		homeTeamTimeout: 0,
		awayTeamTimeout: 0,
		finished: false,
		events: []
	};

	return this;
}

util.inherits(Match, EventEmitter);

Match.prototype.notification = undefined;

Match.prototype.getCurrentSet = function () {
	return this.state.sets[this.state.currentSet];
};

Match.prototype.nextSet = function () {
	this.state.currentSet++;
	this.currentSetScore = this.getCurrentSet();
};

Match.prototype.setPrivateState = function (state) {
	this.state = state;
};

Match.prototype.addHomeTeam = function (team) {
	this.state.hometeam = team;
};

Match.prototype.homeTeam = function () {
	return this.state.hometeam.players();
};

Match.prototype.homeTeamColor = function () {
	return this.state.hometeam.color();
};

Match.prototype.addAwayTeam = function (team) {
	this.state.awayteam = team;
};

Match.prototype.awayTeam = function () {
	return this.state.awayteam.players();
};

Match.prototype.awayTeamColor = function () {
	return this.state.awayteam.color();
};

Match.prototype.sets = function () {
	return this.state.sets;
};

Match.prototype.addEvent = function (msg) {
	this.state.events.push(msg);
};

Match.prototype.homeTeamTakesTimeout = function () {
	this.state.homeTeamTimeout = 1;
	this.state.events.push(
		this.state.hometeam.display() +
    ' takes timeout on ' +
    this.getCurrentSet().score.join('-'));
};

Match.prototype.awayTeamTakesTimeout = function () {
	this.state.awayTeamTimeout = 1;
	this.state.events.push(
		this.state.awayteam.display() +
    ' takes timeout on ' +
    this.getCurrentSet().score.join('-'));
};

export default Match;
