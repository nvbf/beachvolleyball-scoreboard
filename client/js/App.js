/** @jsx React.DOM  */
'use strict';
var React = require('react');

var AddTeam = require('./add-team.js');
var ShowTeam = require('./show-team.js');

var App = React.createClass({

    showB: function () {
        document.getElementsByClassName('addTeamA')[0].style.display = 'none';
        document.getElementsByClassName('addTeamB')[0].style.display = 'inline';
    },

    showScoreboard: function () {
        document.getElementsByClassName('addTeamContainer')[0].style.display = 'none';
        document.getElementsByClassName('showTeamA')[0].style.display = 'inline';
        document.getElementsByClassName('showTeamB')[0].style.display = 'inline';
    },


    getInitialState: function () {
        return {
            teamA: {
                teamInital : "A",
                player1: "Player 1",
                player2: "Player 2",
                set1: 0,
                set2: 0,
                set3: 0
            },
            teamB: {
                teamInital : "B",
                player1: "Player 1",
                player2: "Player 2",
                set1: 0,
                set2: 0,
                set3: 0
            }
        }
    },

    submitTeamFunction: function (team) {
        return function (name1, name2) {
            var stateObject = {};
            stateObject[team] = {
                player1: name1,
                player2: name2
            };
            this.setState(stateObject)
        }.bind(this);
    },

    submitTeamA: function (name1, name2) {
        var stateObject = {};
        stateObject['teamA'] = {
            player1: name1,
            player2: name2
        };
        this.setState(stateObject)
    },

    submitTeamB: function (name1, name2) {
        var stateObject = {};
        stateObject['teamB'] = {
            player1: name1,
            player2: name2
        };
        this.setState(stateObject)
    },

    addPointA: function(e) {
        e.preventDefault();
        this.setState({teamA : this.state.teamA.set1+1 });
    }.bind(this),

    addPointB: function(e) {
        e.preventDefault();
        this.setState({teamB : this.state.teamB.set1+1 });
    }.bind(this),

    render: function () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4  col-md-offset-4 addTeamContainer" >
                        <div className="addTeamA">
                            <AddTeam team={this.state.teamA} submitFunc={this.submitTeamA} showNext={this.showB} />
                        </div>
                        <div className="addTeamB">
                            <AddTeam team={this.state.teamB} submitFunc={this.submitTeamB} showNext={this.showScoreboard} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-2 showTeamA" >
                            <ShowTeam team={this.state.teamA} addPoint={this.addPointA} />
                        </div>
                        <div className="col-md-4 showTeamB">
                            <ShowTeam team={this.state.teamB} addPoint={this.addPointB}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

React.renderComponent(<App />, document.body);