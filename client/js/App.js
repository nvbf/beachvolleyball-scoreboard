/** @jsx React.DOM  */
'use strict';

var React = require('react');


var match = require('./Match');
var Scoreboard = require('./Scoreboard');
var AddAwayTeam= require('./AddAwayTeam');
var AddHomeTeam = require('./AddHomeTeam');

var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

var App = React.createClass({
    getInitialState: function () {
        return match.state
    },


    addPointA: function (e) {
        event.preventDefault();
        match.addPointHomeTeam();
        this.setState(match.state);
    },

    addPointB: function (e) {
        event.preventDefault();
        match.addPointAwayTeam();
        this.setState(match.state);
    },

    render: function () {
        return (
            <div>
                <h1> Start </h1>
                <RouteHandler/>
            </div>
        )
    }
});

var routes = (
    <Route handler={App} path="/">
        <DefaultRoute  name="hometeam" handler={AddHomeTeam} />
        <Route name="awayteam" handler={AddAwayTeam} />
        <Route name="scoreboard" handler={Scoreboard} />
    </Route>
);


Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
});