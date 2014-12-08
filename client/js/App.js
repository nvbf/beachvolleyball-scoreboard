/** @jsx React.DOM  */
'use strict';

var React = require('react');
var Router = require('react-router');

var AddHomeTeam = require('./AddHomeTeam');
var Match = require('./Match');
var match = new Match();

var App = React.createClass({
    displayName: function() {
        return "App";
    },

    render: function () {
        return (
            <AddHomeTeam match={match}/>
        )
    }
});

React.render(<App />, document.body);