const util = require('util');
const EventEmitter = require('events').EventEmitter;
const superagent = require('superagent');
// TODO: wtf is this
const apiUrl = 'https://scoreboard-api-sindresvendby.c9.io/api/matches/';
const MatchApi = require('./match-api');
let matchNumber;

function MatchNotifications(match, api) {
	this.match = match;
	this.api = api;
	const sets = this.match.state.sets;

	sets.map(set => {
		set.notification = this;
	});

	this.notify = function () {
		const match = this.match;
		const set1 = match.state.sets[0];
		const set2 = match.state.sets[1];

		if (match.matchNumber) {
			this.api.update(match);
		}

		if (match.getCurrentSet().isFinished()) {
			if (match.state.currentSet == 2) {
				return this.emit('match-notification');
			}

			if (match.state.currentSet === 1) {
				if ((set1.isSetWonByAwayTeam() && set2.isSetWonByAwayTeam()) ||
          (set1.isSetWonByHomeTeam() && set2.isSetWonByHomeTeam())) {
					return this.emit('match-notification');
				}
			}
			match.nextSet();
			return this.emit('set-notification');
		}
		if (match.getCurrentSet().isTTO()) {
			return this.emit('tto-notification');
		}
		if (match.getCurrentSet().shouldChangeSide()) {
			return this.emit('switch-notification');
		}
	};

	this.on('point-added', this.notify);

	return this;
}

util.inherits(MatchNotifications, EventEmitter);

module.exports = MatchNotifications;
