/** @jsx React.DOM  */
'use strict';

var AddTeam = require('./add-team.js');

var React = require('react');
var Team = require('./Team');


var AddTeamContainer = React.createClass({

    submitTeamA: function (name1, name2) {
        match.hometeam(new Team(name1, name2));
        this.setState(
            match.state
        );
    },

    submitTeamB: function (name1, name2) {
        match.awayteam(new Team(name1, name2));
        this.setState(
            match.state
        );
    },


    render: function () {
        return (
            <div className="col-md-4  col-md-offset-4 addTeamContainer" >
                <div className="addTeamA">
                    <AddTeam submitFunc={this.submitTeamA} showNext="B" />
                </div>
                <div className="addTeamB">
                    <AddTeam submitFunc={this.submitTeamB} showNext="showScoreboard" />
                </div>
            </div>
        );
    }
});

module.exports = AddTeamContainer;