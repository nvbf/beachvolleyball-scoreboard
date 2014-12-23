/** @jsx React.DOM  */
'use strict';

var React = require('react');
var Match = require('./Match');
var AddHomeTeam = require('./AddHomeTeam');
var AddAwayTeam = require('./AddAwayTeam');
var Scoreboard = require('./Scoreboard');

var match = new Match();

var App = React.createClass({
    displayName: function () {
        return "App";
    },

    changeState: function () {
        var that = this;
        return function (state) {
            that.setState(
                state
            );
        }
    },

    getInitialState: function () {
        return {
            show: 'AddHomeTeam',
            match: match.state
        }
    },

    render: function () {
        var show = this.state.show;
        var changeState = this.changeState();

        if (show === "AddHomeTeam") {
            return <AddHomeTeam changeState={changeState} match={match} />;
        }
        else if (show === "AddAwayTeam") {
            return <AddAwayTeam changeState={changeState} match={match} />;
        }
        else {
            return <Scoreboard match={match} />
        }
    }
});

window.React = React;

React.render(<App />, document.body);