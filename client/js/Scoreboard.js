/** @jsx React.DOM  */
'use strict';

var React = require('react');

var Scoreboard = React.createClass({

    getInitialState: function() {
        return this.props.match.state;
    },

    pointToHomeTeam: function (e) {
        event.preventDefault();
        this.props.match.addPointHomeTeam();
        this.setState(this.props.match.state)
    },

    pointToAwayTeam: function (e) {
        event.preventDefault();
        this.props.match.addPointAwayTeam();
        this.setState(this.props.match.state)
    },

    render: function () {
        return (
            <div className="container">
                <div className="row">
                    <div className="row">
                        <div className="col-md-4 col-md-offset-2 showTeamA" >
                            <div>
                                <div className="headline">
                                    <h3>
                                        <div className="team-name">

                                        {this.props.match.homeTeam().player1} - {this.props.match.homeTeam().player2}
                                        </div>
                                    </h3>
                                </div>
                                <div className="team-score">
                                    <h3>
                                            {this.state.currentSetScore.home}
                                    </h3>
                                    <button className="btn btn-primary" onClick={this.pointToHomeTeam}>Legg til Poeng</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 showTeamB">
                            <div>
                                <div className="headline">
                                    <h3>
                                        <div className="team-name">
                                        {this.props.match.awayTeam().player1} - {this.props.match.awayTeam().player2}
                                        </div>
                                    </h3>
                                </div>
                                <div className="team-score">
                                    <h3>
                                            {this.state.currentSetScore.away}
                                    </h3>
                                    <button className="btn btn-primary" onClick={this.pointToAwayTeam}>Legg til Poeng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = Scoreboard;