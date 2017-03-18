const should = require('should');
const sinon = require('sinon');
const Match = require('./../src/js/domain/match');
const Set = require('./../src/js/domain/set');
const Team = require('./../src/js/domain/team');
const matchTestUtil = require('./match-test-util');

describe('Match Logic', () => {
	it('Adding Hometeam', () => {
		const match = new Match();
		const hometeam = new Team('player1', 'player2');
		match.addHomeTeam(hometeam);
		match.state.hometeam.should.eql(hometeam);
	});

	it('Adding Awayteam', () => {
		const match = new Match();
		const awayteam = new Team('player3', 'player4');
		match.addAwayTeam(awayteam);
		match.state.awayteam.should.eql(awayteam);
	});
});

describe('Test Match Util functions', () => {
	const option = {
		length: 21,
		switch: 7
	};

	it('Setting state', () => {
		let match;
		const score = [new Set(option), new Set(option), new Set(option)];
		score[0] = [19, 21];
		score[1] = [23, 21];
		score[2] = [13, 14];
		match = matchTestUtil.setScoreToTest(score);
		match.state.currentSet.should.be.equal(2);
		match.state.currentSetScore.should.eql([13, 14]);
	});
});
