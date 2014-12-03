/** @jsx React.DOM  */
'use strict';

var React = require('react');

var Scoreboard = React.createClass({

    pointToHomeTeam: function (e) {
        this.props.test = "HJEMME";
        event.preventDefault();
        this.props.match.addPointHomeTeam();
        this.setState(
            match.state
        )
    },

    pointToAwayTeam: function (e) {
        this.props.test = "BORTE";
        event.preventDefault();
        this.props.match.addPointAwayTeam();
    },

    render: function () {
        return (
            <div className="container">
                <div className="row">
                    <div className="row">
                        <div className="col-md-4 col-md-offset-2 showTeamA" >
                            {this.props.test}
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
                                            {this.props.match.getCurrentSet()[0]}
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
                                            {this.props.match.getCurrentSet()[1]}
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