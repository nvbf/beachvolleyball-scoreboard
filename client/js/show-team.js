/** @jsx React.DOM  */
'use strict';

var React = require('react');


var ShowTeam = React.createClass({
    render: function () {
        return (
            <div>
                <div className="col-md-8 team-name">
                    <p>
                       Team {this.props.team.teamInital}
                    </p>
                    <ul>
                        <li>
                            {this.props.team.player1}
                        </li>
                        <li>
                            {this.props.team.player2}
                        </li>
                    </ul>
                </div>
                <div className="col-md-4 team-score">
                    <h3>
                        {this.props.team.set1}
                    </h3>
                    <form onSubmit={this.props.addPoint}>
                        <input className="btn btn-default" type="submit" value="+1 Poeng"> </input>
                    </form>
                </div>
            </div>
        )
    }
});

module.exports = ShowTeam;