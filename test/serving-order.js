const should = require('should');
const sinon = require('sinon');
const ServingOrder = require('./../src/js/domain/serving-order');

describe('serving-order', () => {
	const player1 = 'Player Serving as nr 1';
	const player2 = 'Player Serving as nr 2';
	const player3 = 'Player Serving as nr 3';
	const player4 = 'Player Serving as nr 4';
	const servingOrder = new ServingOrder([
		player1,
		player2,
		player3,
		player4
	])
  ;

	it('Set ServingOrder', () => {
		const playerToServe = servingOrder.toServe();
		playerToServe.should.be.eql(player1);
	});

	it('ServingOrder NextServer', () => {
		const playerToServe = servingOrder.nextServer();
		playerToServe.should.be.eql(player2);
	});

	it('ServingOrder Starting from start again', () => {
		servingOrder.nextServer(); // Player3
		servingOrder.nextServer(); // Player4
		const playerToServe = servingOrder.nextServer();
		playerToServe.should.be.eql(player1);
	});
});
