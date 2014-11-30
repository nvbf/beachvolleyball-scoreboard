function Team() {
    this.state = {
        player1: "",
        player2: "",
        firstToServe : 0
    };
   return this;
}

Team.prototype.setPlayerNames = function (player1, player2) {
    this.state.player1 = player1;
    this.state.player2 = player2;
};

exports = module.exports = new Match();