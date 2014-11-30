/** @jsx React.DOM  */
'use strict';

var React = require('react');

var AddTeam = require('./add-team.js');

var App = React.createClass({
        getInitialState: function () {
            return {
                Aplayer1: "Player 1",
                Aplayer2: "Player 2",
                Aset1: 0,
                Aset2: 0,
                Aset3: 0,
                Bplayer1: "Player 1",
                Bplayer2: "Player 2",
                Bset1: 0,
                Bset2: 0,
                Bset3: 0
            }
        },

        showB: function () {
            document.getElementsByClassName('addTeamA')[0].style.display = 'none';
            document.getElementsByClassName('addTeamB')[0].style.display = 'inline';
        }
        ,
        showScoreboard: function () {
            document.getElementsByClassName('addTeamContainer')[0].style.display = 'none';
            document.getElementsByClassName('showTeamA')[0].style.display = 'inline';
            document.getElementsByClassName('showTeamB')[0].style.display = 'inline';
        }
        ,

        submitTeamA: function (name1, name2) {
            this.setState({
                Aplayer1: name1,
                Aplayer2: name2
            });
        },

        submitTeamB: function (name1, name2) {
            this.setState({
                Bplayer1: name1,
                Bplayer2: name2
            });
        },

        addPointA: function (e) {
            event.preventDefault();
            this.setState({Aset1: this.state.Aset1 + 1});
        },

        addPointB: function (e) {
            event.preventDefault();

            this.setState({Bset1: 1});
        }
        ,

        render: function () {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-4  col-md-offset-4 addTeamContainer" >
                            <div className="addTeamA">
                                <AddTeam state={this.state} teamInitial="A" submitFunc={this.submitTeamA} showNext={this.showB} />
                            </div>
                            <div className="addTeamB">
                                <AddTeam state={this.state} teamInitial="B" submitFunc={this.submitTeamB} showNext={this.showScoreboard} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-md-offset-2 showTeamA" >
                                <div>
                                    <div className="headline">
                                        <h3>
                                            <div className="team-name">
                                                {this.state.Aplayer1} - {this.state.Aplayer2}
                                            </div>
                                        </h3>
                                    </div>
                                    <div className="team-score">
                                        <h3>
                                            {this.state.Aset1}
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
                                                {this.state.Bplayer1} - {this.state.Bplayer2}
                                            </div>
                                        </h3>
                                    </div>
                                    <div className="team-score">
                                        <h3>
                                            {this.state.Bset1}
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
    })
    ;

React.renderComponent(<App />, document.body);
