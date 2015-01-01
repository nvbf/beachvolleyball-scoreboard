var should = require('should'),
  sinon = require('sinon'),
  VolleyballTechnicalTimeout = require('./../../../src/js/domain/VolleyballTechnicalTimeout');

describe('volleyballTechnicalTimeoutTest', function() {
  var volleyballTechnicalTimeout = new VolleyballTechnicalTimeout();

  it('volleyballTechnicalTimeoutTest before first TTO', function() {
    var set = {};
    set.score = [4, 4];
    volleyballTechnicalTimeout.isTTO(set).should.not.be.ok;
  });

  it('volleyballTechnicalTimeoutTest Time for first TTO', function() {
    var set = {};
    set.score = [8, 7];
    volleyballTechnicalTimeout.isTTO(set).should.be.ok;
  });

  it('volleyballTechnicalTimeoutTest not time for timeout after first TTO', function() {
    var set = {};
    set.score = [8, 8];
    volleyballTechnicalTimeout.isTTO(set).should.not.be.ok;
  });

  it('volleyballTechnicalTimeoutTest time for second timeout', function() {
    var set = {};
    set.score = [16, 15];
    volleyballTechnicalTimeout.isTTO(set).should.be.ok;
  });

  it('volleyballTechnicalTimeoutTest not more TTO left', function() {
    var set = {};
    set.score = [17, 16];
    volleyballTechnicalTimeout.isTTO(set).should.not.be.ok;
  });
});
