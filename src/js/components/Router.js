/** @jsx React.DOM  */
'use strict';

var React = require('react'),
    PublicBoard = require('./PublicBoard'),
    Main = require('./Main'),
    MatchApi = require('./../domain/MatchApi'),
    Router;


Router = React.createClass({
  
  displayName: function() {
    return 'Router';
  },
  
  getInitialState: function() {
    return {
        "hometeam": '',
        "awayteam": '',
        "sets": []
    };
  },
  
  splitUpKeyValue: function (param) {
    return param.split('='); 
  },

  areKeyId: function (keyValue) {
    return (keyValue[0] === 'match');
  },
  
  render: function() {
    var matchId;
    var _this = this;
    var getParams = document.location.search.substring(1).split('&');
    var idArgument = 
      getParams
        .map(this.splitUpKeyValue)
        .filter(this.areKeyId);
        
    if(idArgument[0]) {
        matchId = idArgument[0][1];
    }
      
      
    if(matchId) {
        var api = new MatchApi();
        api.getMatch(matchId, function(ht, aw, s) {
            this.setState({
                hometeam: ht,
                    awayteam: aw,
                    sets: s
            })
          }.bind(this)); 
        return <PublicBoard 
                  hometeam={this.state.hometeam} 
                  awayteam={this.state.awayteam}
                  score={this.state.sets} 
                />;
    } else {
        return <Main />;
    }
  }
});

window.React = React;
React.render(<Router />, document.body);