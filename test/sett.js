require('should'); // eslint-disable-line import/no-unassigned-import
const sinon = require('sinon');
const Sett = require('./../src/domain/sett');

describe('Sett Logic', () => {
	const option = {
		length: 21,
		switch: 7
	};

	it('Sett should be 1-0, after we add point to hometeam', () => {
		const sett = new Sett(option);
		sett.addPointHomeTeam();
		sett.score.should.eql([1, 0]);
	});

	it('Sett should be 0-1, after we add point to awayteam', () => {
		const sett = new Sett(option);
		sett.addPointAwayTeam();
		sett.score.should.eql([0, 1]);
	});

	it('should send notification on every point', () => {
		const sett = new Sett(option);
		const notificationService = {};

		notificationService.emit = sinon.spy();
		sett.teamCurrentlyServing = "hometeam";
		sett.notification = notificationService;
		sett.score = [2, 3];
		sett.addPointHomeTeam();

		notificationService.emit.calledWith('point-added');
		sinon.assert.calledOnce(notificationService.emit);
		sett.score.should.eql([3, 3]);
	});

	it('Sett need to be win by 2 points', () => {
		const sett = new Sett(option);
		sett.score = [20, 20];
		sett.addPointHomeTeam();
		sett.isSetWonByHomeTeam().should.not.be.ok;
	});

	it('Sett need to be win by 2 points', () => {
		const sett = new Sett(option);
		sett.score = [21, 20];
		sett.addPointHomeTeam();
		sett.isSetWonByHomeTeam().should.be.ok;
	});

	it('Awayteam could also win by 2 points', () => {
		const sett = new Sett(option);
		sett.score = [20, 21];
		sett.addPointAwayTeam();
		sett.isSetWonByAwayTeam().should.be.ok;
	});

	it('Awayteam could also win by 2 points', () => {
		const sett = new Sett(option);
		sett.score = [20, 21];
		sett.addPointAwayTeam();
		sett.isSetWonByAwayTeam().should.be.ok;
	});

	it('Should switch each 7 points ', () => {
		const sett = new Sett(option);
		sett.score = [5, 2];
		sett.shouldChangeSide().should.be.ok;
	});

	it('Should not switch on 5 points (option.switch = 7)', () => {
		const sett = new Sett(option);
		sett.score = [1, 4];
		sett.shouldChangeSide().should.not.be.ok;
	});

	it('Should not switch on 5 points (option.switch = 7)', () => {
		const sett = new Sett(option);
		sett.score = [1, 4];
		sett.shouldChangeSide().should.not.be.ok;
	});

	it('Sett should be finished', () => {
		const sett = new Sett(option);
		sett.score = [25, 23];
		sett.isFinished().should.be.ok;
	});

	it('Sett should not be finised', () => {
		const sett = new Sett(option);
		sett.score = [17, 20];
		sett.isFinished().should.be.not.ok;
	});

	it('Sett is not started on', () => {
		const sett = new Sett(option);
		sett.score = [0, 0];
		sett.hasStarted().should.be.not.be.ok;
	});

	it('Sett is not started on', () => {
		const sett = new Sett(option);
		sett.score = [1, 0];
		sett.hasStarted().should.be.ok;
	});
});
