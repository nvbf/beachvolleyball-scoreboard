function Team(player1, player2, color = null) {
	this.state = {
		player1,
		player2,
		color: color
	};
	return this;
}

Team.prototype.players = function () {
	return {
		player1: this.state.player1,
		player2: this.state.player2
	};
};

Team.prototype.color = function() {
	return this.state.color;
}

Team.prototype.display = function () {
	return this.state.player1 + ' - ' + this.state.player2;
};

module.exports = Team;
