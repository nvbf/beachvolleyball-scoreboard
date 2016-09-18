'use strict';
import React from 'react';
const MatchApi = require('./../domain/MatchApi');

var PublicBoard = React.createClass({
  displayName() {
    return 'PublicBoard';
  },

  propTypes: {
    matchId: React.PropTypes.string.isRequired
  },

  componentDidMount() {
    var api = new MatchApi();
    this.intervalId = setInterval(function() {
      api.getMatch(this.props.matchId, function(hTeam, aTeam, score) {
        this.setState({
          hometeam: hTeam,
          awayteam: aTeam,
          score: score
        })
      }.bind(this))
    }.bind(this), 1000);
  },

  componentWillUnmount() {
    clearInterval(this.intervalId);
  },

  getInitialState() {
    return {
      hometeam: 'Loading players... ',
      awayteam: 'Loading players... ',
      score: [
        0, 0, 0, 0, 0, 0
      ]
    };
  },

  render() {
    return (
      <div className="publicboard-container">
        <div className="publicboard">
          <div className="container scoreboard">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Match standing</h2>
              </div>
              <div className="panel-body">
                <table className="table table-striped">
                  <tr>
                    <td>
                      {this.state.hometeam}
                    </td>
                    <td className='set'>
                      {this.state.score[0]}
                    </td>
                    <td className='set'>
                      {this.state.score[2]}
                    </td>
                    <td className='set'>
                      {this.state.score[4]}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {this.state.awayteam}
                    </td>
                    <td className='set'>
                      {this.state.score[1]}
                    </td>
                    <td className='set'>
                      {this.state.score[3]}
                    </td>
                    <td className='set'>
                      {this.state.score[5]}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PublicBoard;
