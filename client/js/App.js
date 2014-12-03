/** @jsx React.DOM  */
'use strict';

var React = require('react');
var match = require('./Match');
var AddHomeTeam = require('./AddHomeTeam');

var Router = require('react-router');


var App = React.createClass({

    render: function () {
        return (
            <AddHomeTeam match={match}/>
        )
    }
});

//var routes = (
//    <Route handler={App} path="/">
//        <DefaultRoute  name="hometeam" handler={AddHomeTeam} />
//        <Route name="awayteam" handler={AddAwayTeam} />
//        <Route name="scoreboard" handler={Scoreboard} />
//    </Route>
//);


//Router.run(routes, function (Handler, whatisthis) {
//
//    React.render(<Handler whatisthis={whatisthis} />, document.body);
//});


React.render(<App />, document.body);