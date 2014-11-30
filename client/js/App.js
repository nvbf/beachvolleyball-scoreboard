/** @jsx React.DOM  */
'use strict';

var React = require('react');


//var Scoreboard = require('./../../backup/Scoreboard');
var Match = require('./Match');
var match = new Match();
var AddTeamContainer = require('./add-Team-Container');

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

    //<Scoreboard match={this.match} />
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
        <DefaultRoute handler={AddTeamContainer }/>
    </Route>
);


Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
});