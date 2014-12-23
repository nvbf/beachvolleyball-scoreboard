/** @jsx React.DOM  */
'use strict';
var React = require('react');
var NotificationModal = require('./NotificationModal');
var Button = require('react-bootstrap').Button;


var Scoreboard = React.createClass({
    displayName: function () {
        return "Scoreboard";
    },

    handleHide: function () {
        this.refs.changeSideDialog.hidden();
    }.bind(this),

    getInitialState: function () {
        return this.props.match.state;
    },

    pointToHomeTeam: function (event) {
        event.preventDefault();
        this.props.match.addPointHomeTeam();
        this.setState(this.props.match.state);
    },

    pointToAwayTeam: function (event) {
        event.preventDefault();
        this.props.match.addPointAwayTeam();
        this.setState(this.props.match.state);
    },

    render: function () {
        return (
            <div className="container scoreboard">
                <div className="switch-modal">
                    <NotificationModal message="Sidebytte" eventTrigger="switch" match={this.props.match} />
                </div>
                <div className="set-finished-modal">
                    <NotificationModal message="Settet er ferdig" eventTrigger="set-finished" match={this.props.match} />
                </div>
                <div className="game-finished-modal">
                    <NotificationModal message="Kampen er ferdig" eventTrigger="match-finished" match={this.props.match} />
                </div>

                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="row">
                            <Button type="submit" bsSize="small" bsStyle="primary" onClick={this.pointToHomeTeam}>Legg til Poeng</Button>

                            <h3 className="names">
                                            {this.props.match.homeTeam().player1} - {this.props.match.homeTeam().player2}
                            </h3>
                            <h3 className="set">
                                            {this.state.sets[0][0]}
                            </h3>
                            <h3 className="set">
                                            {this.state.sets[1][0]}
                            </h3>
                            <h3 className="set">
                                            {this.state.sets[2][0]}
                            </h3>
                        </div>
                        <div className="row">

                            <Button type="submit" bsSize="small" bsStyle="primary" onClick={this.pointToAwayTeam}>Legg til Poeng</Button>
                            <h3 className="names">
                                            {this.props.match.awayTeam().player1} - {this.props.match.awayTeam().player2}
                            </h3>
                            <h3 className="set">
                                            {this.state.sets[0][1]}
                            </h3>
                            <h3 className="set">
                                            {this.state.sets[1][1]}
                            </h3>
                            <h3 className="set">
                                            {this.state.sets[2][1]}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
});

module.exports = Scoreboard;