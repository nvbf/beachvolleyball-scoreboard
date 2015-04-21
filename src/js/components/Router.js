'use strict';

const React = require('react');
const  PublicBoard = require('./PublicBoard');
const  Main = require('./Main');

var Router = React.createClass({

  displayName() {
    return 'Router';
  },

  splitUpKeyValue(param) {
    return param.split('=');
  },

  areKeyId(keyValue) {
    return (keyValue[0] === 'match');
  },

  render() {
    var matchId;
    var getParams = document.location.search.substring(1).split('&');
    var idArgument =
      getParams
        .map(this.splitUpKeyValue)
        .filter(this.areKeyId);

    if (idArgument[0]) {
      matchId = idArgument[0][1];
    }

    if (matchId) {
      return <PublicBoard matchId={matchId} />;
    } else {
      return <Main />;
    }
  }
});

window.React = React;
React.render(<Router />, document.body);
