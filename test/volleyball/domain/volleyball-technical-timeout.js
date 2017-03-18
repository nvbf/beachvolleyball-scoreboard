const should = require('should');
const sinon = require('sinon');
const VolleyballTechnicalTimeout = require('./../../../src/js/domain/volleyball-technical-timeout');

describe('volleyballTechnicalTimeoutTest', () => {
	const volleyballTechnicalTimeout = new VolleyballTechnicalTimeout();

	it('volleyballTechnicalTimeoutTest before first TTO', () => {
		const set = {};
		set.score = [4, 4];
		volleyballTechnicalTimeout.isTTO(set).should.not.be.ok;
	});

	it('volleyballTechnicalTimeoutTest Time for first TTO', () => {
		const set = {};
		set.score = [8, 7];
		volleyballTechnicalTimeout.isTTO(set).should.be.ok;
	});

	it('volleyballTechnicalTimeoutTest not time for timeout after first TTO', () => {
		const set = {};
		set.score = [8, 8];
		volleyballTechnicalTimeout.isTTO(set).should.not.be.ok;
	});

	it('volleyballTechnicalTimeoutTest time for second timeout', () => {
		const set = {};
		set.score = [16, 15];
		volleyballTechnicalTimeout.isTTO(set).should.be.ok;
	});

	it('volleyballTechnicalTimeoutTest not more TTO left', () => {
		const set = {};
		set.score = [17, 16];
		volleyballTechnicalTimeout.isTTO(set).should.not.be.ok;
	});
});
