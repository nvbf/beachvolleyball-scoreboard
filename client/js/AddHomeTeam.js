/** @jsx React.DOM  */
'use strict';

var React = require('react');
var Team = require('./Team');
var AddAwayTeam = require('./AddAwayTeam');

var AddHomeTeam = React.createClass({

    handleSubmit: function (e) {
        e.preventDefault();
        var player1 = this.refs.player1.getDOMNode().value.trim();
        var player2 = this.refs.player2.getDOMNode().value.trim();
        if (!player2 || !player1) {
            console.error("Fyll inn navn");
            return;
        }
        this.props.match.addHomeTeam(new Team(player1, player2));
        React.render(<AddAwayTeam match={this.props.match}/>, document.body);
    },

    render: function () {
        return (
            <div className="col-md-4  col-md-offset-4 addTeamContainer" >
                <div>
                    <h2>Legg til Hjemmelag</h2>
                    <form className="add-team-form" onSubmit={this.handleSubmit} >
                        <div className="form-group">
                            <input type="text" className="form-control" ref="player1"></input>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" ref="player2"></input>
                        </div>
                        <button type="submit" className="btn btn-primary pull-right">Add Team</button>
                    </form>
                </div>
            </div>
        )
    }
});

module.exports = AddHomeTeam;