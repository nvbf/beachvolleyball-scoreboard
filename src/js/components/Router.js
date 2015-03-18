/** @jsx React.DOM  */
'use strict';

var React = require('react'),
    PublicBoard = require('./PublicBoard'),
    Main = require('./Main'),
    Router;


Router = React.createClass({
  
  displayName: function() {
    return 'Router';
  },
  
  splitUpKeyValue: function (param) {
    return param.split('='); 
  },

  areKeyId: function (keyValue) {
    return (keyValue[0] === 'match');
  },
  
  render: function() {
    var match;
    var _this = this;
    var getParams = document.location.search.substring(1).split('&');
    var idArgument = 
      getParams
        .map(_this.splitUpKeyValue)
        .filter(_this.areKeyId);
        
    if(idArgument[0]) {
        match = idArgument[0][1];
    }
      
      
    if(match) {
        return <PublicBoard />;
    } else {
        return <Main />;
    }
  }
});

window.React = React;
React.render(<Router />, document.body);