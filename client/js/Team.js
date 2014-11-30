function Team(player1, player2) {
    this.state = {
        player1: player1,
        player2: player2,
    };
   return this;
}


Team.prototype.players = function() {
    return {
        player1: this.state.player1,
        player2: this.state.player2
    }
};

exports = module.exports = Team;