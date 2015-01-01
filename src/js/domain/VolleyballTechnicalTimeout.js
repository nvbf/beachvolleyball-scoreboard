//TTO = Technical TimeOut

function VolleyballTechnicalTimeout() {
  this.ttoLimit = [8, 16];
  return this;
}

/**
 * @param set Set
 */
VolleyballTechnicalTimeout.prototype.isTTO = function(set) {

  if (!(this.ttoLimit.length > 0)) {
    return false;
  }

  if ((set.score[0] === this.ttoLimit[0]) || (set.score[1] === this.ttoLimit[0])) {
    this.ttoLimit.shift();
    return true;
  }
  return false;
};

module.exports = VolleyballTechnicalTimeout;
