'use strict';
const React = require('react');
const MatchApi = require('./../domain/match-api');

const PublicBoard = React.createClass({

	propTypes: {
		matchId: React.PropTypes.string.isRequired
	},

	componentDidMount() {
		const api = new MatchApi();
		this.intervalId = setInterval(() => {
			api.getMatch(this.props.matchId, (hTeam, aTeam, score) => {
				this.setState({
					hometeam: hTeam,
					awayteam: aTeam,
					score
				});
			});
		}, 1000);
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
                    <td className="set">
                      {this.state.score[0]}
                    </td>
                    <td className="set">
                      {this.state.score[2]}
                    </td>
                    <td className="set">
                      {this.state.score[4]}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {this.state.awayteam}
                    </td>
                    <td className="set">
                      {this.state.score[1]}
                    </td>
                    <td className="set">
                      {this.state.score[3]}
                    </td>
                    <td className="set">
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
