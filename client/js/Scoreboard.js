/** @jsx React.DOM  */
'use strict';

var React = require('react');
var match = require('./Match');

var Scoreboard = React.createClass({
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
                                        {match.hometeam.players().person1} - {match.hometeam.players().person2}
                                        </div>
                                    </h3>
                                </div>
                                <div className="team-score">
                                    <h3>
                                            {match.getCurrentSet()[0]}
                                    </h3>
                                    <button className="btn btn-primary" onClick={this.addPointA}>Legg til Poeng</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 showTeamB">
                            <div>
                                <div className="headline">
                                    <h3>
                                        <div className="team-name">
                                        {match.hometeam.players().person1} - {match.hometeam.players().person1}
                                        </div>
                                    </h3>
                                </div>
                                <div className="team-score">
                                    <h3>
                                            {match.getCurrentSet()[0]}
                                    </h3>
                                    <button className="btn btn-primary" onClick={this.addPointB}>Legg til Poeng</button>
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