/** @jsx React.DOM  */
'use strict';
var React = require('react');
window.React = require('react');

var Head = require('./Head.js');


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
        this.refs.player1.getDOMNode().value = '';
        this.refs.player2.getDOMNode().value = '';
    },

    render: function () {
        return (
            <div>
                <h4>Add Team</h4>
                <form className="add-team-form" onSubmit={this.handleSubmit}>
                    <div className="col-md-4">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="player1" placeholder={this.props.player1}></input>
                        </div>
                        <div className="input-group">
                            <input type="text" className="form-control" ref="player2" placeholder={this.props.player2}></input>
                        </div>
                        <button type="submit" className="btn btn-default">Add Team</button>
                    </div>
                </form>
            </div>
        )
    }
});

var ShowTeam = React.createClass({
    render: function () {
        return (
            <div>
                <p>{this.props.team}</p>
                <ul>
                    <li>{this.props.player1}</li>
                    <li>{this.props.player2}</li>
                </ul>
            </div>
        )
    }
});

var App = React.createClass({

    getInitialState: function () {
        return {
            teamA: {
                player1: "Navn A1",
                player2: "Navn A2"
            },
            teamB: {
                player1: "Navn B1",
                player2: "Navn B2"
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
            this.setState(stateObject);
        }
    },

    render: function () {
        return (
            <div className="container">
                <div className="row">
                    <AddTeam team="teamA" submitFunc={this.submitTeamFunction("teamA")} />
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <ShowTeam team="Team A" player1={this.state.teamA.player1} player2={this.state.teamA.player2} />
                    </div>
                </div>
            </div>
        )
    }
});

React.renderComponent(<Head/>, document.head);
React.renderComponent(<App />, document.body);

