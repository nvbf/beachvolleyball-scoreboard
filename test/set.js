const should = require('should');
const sinon = require('sinon');
const Set = require('./../src/js/domain/set');
const Team = require('./../src/js/domain/team');
const matchTestUtil = require('./match-test-util');

describe('Set Logic', () => {
	const option = {
		length: 21,
		switch: 7
	};

	it('Set should be 1-0, after we add point to hometeam', () => {
		const set = new Set(option);
		set.addPointHomeTeam();
		set.score.should.eql([1, 0]);
	});

	it('Set should be 0-1, after we add point to awayteam', () => {
		const set = new Set(option);
		set.addPointAwayTeam();
		set.score.should.eql([0, 1]);
	});

	it('should send notification on every ', () => {
		const set = new Set(option);
		const notificationService = {};

		notificationService.emit = sinon.spy();

		set.notification = notificationService;
		set.score = [2, 3];
		set.addPointHomeTeam();

		notificationService.emit.calledWith('point-added');
		notificationService.emit.calledOnce;
		set.score.should.eql([3, 3]);
	});

	it('Set need to be win by 2 points', () => {
		const set = new Set(option);
		set.score = [20, 20];
		set.addPointHomeTeam();
		set.isSetWonByHomeTeam().should.not.be.ok;
	});

	it('Set need to be win by 2 points', () => {
		const set = new Set(option);
		set.score = [21, 20];
		set.addPointHomeTeam();
		set.isSetWonByHomeTeam().should.be.ok;
	});

	it('Awayteam could also win by 2 points', () => {
		const set = new Set(option);
		set.score = [20, 21];
		set.addPointAwayTeam();
		set.isSetWonByAwayTeam().should.be.ok;
	});

	it('Awayteam could also win by 2 points', () => {
		const set = new Set(option);
		set.score = [20, 21];
		set.addPointAwayTeam();
		set.isSetWonByAwayTeam().should.be.ok;
	});

	it('Should switch each 7 points ', () => {
		const set = new Set(option);
		set.score = [5, 2];
		set.shouldChangeSide().should.be.ok;
	});

	it('Should not switch on 5 points (option.switch = 7)', () => {
		const set = new Set(option);
		set.score = [1, 4];
		set.shouldChangeSide().should.not.be.ok;
	});

	it('Should not switch on 5 points (option.switch = 7)', () => {
		const set = new Set(option);
		set.score = [1, 4];
		set.shouldChangeSide().should.not.be.ok;
	});

	it('Set should be finished', () => {
		const set = new Set(option);
		set.score = [25, 23];
		set.isFinished().should.be.ok;
	});

	it('Set should not be finised', () => {
		const set = new Set(option);
		set.score = [17, 20];
		set.isFinished().should.be.not.ok;
	});

	it('Set is not started on', () => {
		const set = new Set(option);
		set.score = [0, 0];
		set.hasStarted().should.be.not.be.ok;
	});

	it('Set is not started on', () => {
		const set = new Set(option);
		set.score = [1, 0];
		set.hasStarted().should.be.ok;
	});
});
