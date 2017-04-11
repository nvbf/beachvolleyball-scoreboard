'use strict';

const should = require('should');
const sinon = require('sinon');
const MatchApi = require('./../src/domain/match-api');
const Match = require('./../src/domain/match');
const Util = require('./match-test-util');

describe('match-api', () => {
	it('update', () => {
		const match = Util.setScoreToTest();
		const api = new MatchApi();
	});
});
