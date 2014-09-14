/** @jsx React.DOM  */
'use strict';
var React = require('react');

var AddTeam = React.createClass({

    handleSubmit: function (e) {
        e.preventDefault();

        var player1 = this.refs.player1.getDOMNode().value.trim();
        var player2 = this.refs.player2.getDOMNode().value.trim();
        if (!player2 || !player1) {
            console.error("Fyll inn navn");
            return;
        }

        this.props.submitFunc(player1, player2);
        this.props.showNext();
    },

    render: function () {
        return (
            <div>
                <h3>Add Team</h3>
                <form className="add-team-form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control" ref="player1" placeholder={this.props.player1}></input>
                    </div>
                    <div className="form-group">
                        <input  type="text" className="form-control" ref="player2" placeholder={this.props.player2}></input>
                    </div>
                    <button type="submit" className="btn btn-primary  pull-right">Add Team</button>

                </form>
            </div>
        )
    }
});

var ShowTeam = React.createClass({
    render: function () {
        return (
            <div className={this.props.team}>
                <p>Team {this.props.team}</p>
                <ul>
                    <li>{this.props.player1}</li>
                    <li>{this.props.player2}</li>
                </ul>
            </div>
        )
    }
});

var App = React.createClass({

    showB: function() {
      document.getElementById('A').style.display = 'none';
      document.getElementById('B').style.display = 'inline';
    },

    showScoreboard: function() {
        document.getElementById('A').style.display = 'none';
        document.getElementById('B').style.display = 'inline';
    },


    showTeams: function() {

    },

    getInitialState: function () {
        return {
            teamA: {
                player1: "Player 1",
                player2: "Player 2"
            },
            teamB: {
                player1: "Player 1",
                player2: "Player 2"
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

    render: function () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4  col-md-offset-4" >
                        <AddTeam team="teamA" submitFunc={this.submitTeamFunction("teamA")} showNext={this.props.showB}
                        player1={this.state.teamA.player1}
                        player2={this.state.teamA.player2} />
                        <AddTeam team="teamB" submitFunc={this.submitTeamFunction("teamB")} showNext={this.showScoreboard}
                            player1={this.state.teamB.player1}
                            player2={this.state.teamB.player2} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 col-md-offset-2">
                        <ShowTeam team="A" player1={this.state.teamA.player1} player2={this.state.teamA.player2} />
                    </div>
                    <div className="col-md-4">
                        <ShowTeam team="B" player1={this.state.teamB.player1} player2={this.state.teamB.player2} />
                    </div>
                </div>
            </div>
        )
    }
});

React.renderComponent(<App />, document.body);