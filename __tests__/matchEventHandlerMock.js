exports = module.exports = function callbackMock(event) {
  switch (event) {
    case 'switch':
    case 'set-ended':
    case 'match-ended':
      return event;
      break;
    default :
      return
  }
};
