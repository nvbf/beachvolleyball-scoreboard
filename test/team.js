const should = require('should');
const Team = require('./../src/domain/team');

describe('Team Logic', () => {
	it('Add Players to team', () => {
		const team = new Team('Name1', 'Name2');
		team.state.player1.should.equal('Name1');
		team.state.player2.should.equal('Name2');
	});

	it('players function', () => {
		const team = new Team('Name1', 'Name2');
		const expectedResult = {
			player1: team.state.player1,
			player2: team.state.player2
		};
		team.players().should.containEql(expectedResult);
	});
});
