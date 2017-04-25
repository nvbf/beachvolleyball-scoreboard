function Sett(option) {
	this.score = [0, 0];
	this.pointLimit = option.length;
	this.switch = option.switch;
	this.tto = option.tto;
	this.timeoutLimit = option.timeoutLimit;
	this.timeout = {
		homeTeam: 0,
		awayTeam: 0
	};

	this.addPoint = function (teamIndex) {
		this.score[teamIndex]++;
		if (this.notification) {
			this.notification.emit('point-added');
		}
	};

	this.removePoint = function (teamIndex) {
		this.score[teamIndex]--;
		if (this.notification) {
			this.notification.emit('point-remove');
		}
	};

	this.notifyServerOrder = function (team) {
		if (this.teamCurrentlyServing !== team && this.notification) {
			this.notification.emit('switch-server');
		}
	};

	return this;
}

Sett.prototype.setStartServing = function (team) {
	this.teamCurrentlyServing = team;
};

Sett.prototype.isTTO = function () {
	if (!this.tto) {
		return false;
	}

	const score = this.score;
	return ((score[0] + score[1]) === this.tto);
};

Sett.prototype.shouldChangeSide = function () {
	const score = this.score;
  // True every 7 point
	return ((score[0] + score[1]) % this.switch === 0);
};

Sett.prototype.removePointHomeTeam = function () {
	this.notifyServerOrder('hometeam');
	this.teamCurrentlyServing = 'hometeam';
	return this.removePoint(0);
};

Sett.prototype.addPointHomeTeam = function () {
	this.notifyServerOrder('hometeam');
	this.teamCurrentlyServing = 'hometeam';
	return this.addPoint(0);
};

Sett.prototype.removePointAwayTeam = function () {
	this.notifyServerOrder('awayteam');
	this.teamCurrentlyServing = 'awayteam';
	return this.removePoint(1);
};

Sett.prototype.addPointAwayTeam = function () {
	this.notifyServerOrder('awayteam');
	this.teamCurrentlyServing = 'awayteam';
	return this.addPoint(1);
};

Sett.prototype.isSetWonByHomeTeam = function () {
	const score = this.score;
	return (score[0] >= this.pointLimit && score[0] > score[1] + 1);
};

Sett.prototype.isSetWonByAwayTeam = function () {
	const score = this.score;
	return (score[1] >= this.pointLimit && score[1] > score[0] + 1);
};

Sett.prototype.isFinished = function () {
	return (this.isSetWonByHomeTeam() || this.isSetWonByAwayTeam());
};

Sett.prototype.hasStarted = function () {
	return !(this.score[0] === 0 && this.score[1] === 0);
};

export default Sett;
