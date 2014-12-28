var should = require('should'),
  sinon = require('sinon'),
  ServingOrder = require('./../src/js/domain/ServingOrder');

describe('serving-order', function() {

  var player1 = 'Player Serving as nr 1',
    player2 = 'Player Serving as nr 2',
    player3 = 'Player Serving as nr 3',
    player4 = 'Player Serving as nr 4',
    servingOrder = new ServingOrder([
      player1,
      player2,
      player3,
      player4
    ]);

  it('Set ServingOrder', function() {
    var playerToServe = servingOrder.toServe();
    playerToServe.should.be.eql(player1);
  });

  it('ServingOrder NextServer', function() {
    var playerToServe = servingOrder.nextServer();
    playerToServe.should.be.eql(player2);
  });

  it('ServingOrder Starting from start again', function() {
    servingOrder.nextServer(); //player3
    servingOrder.nextServer(); //player4
    var playerToServe = servingOrder.nextServer();
    playerToServe.should.be.eql(player1);
  })

});
