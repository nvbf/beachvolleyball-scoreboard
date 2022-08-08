import React, {Component} from 'react';
//import MatchApi from './../src/domain/match-api';

export default class PublicBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hometeam: 'Loading players... ',
      awayteam: 'Loading players... ',
      score: [
        0, 0, 0, 0, 0, 0
      ]
    };
  }

	splitUpKeyValue(param) {
		return param.split('=');
	}

	areKeyId(keyValue) {
		return (keyValue[0] === 'match');
	}

	componentDidMount() {
		let matchId;
		const getParams = document.location.search.substring(1).split('&');
		const idArgument =
        getParams
        .map(this.splitUpKeyValue)
        .filter(this.areKeyId);

		matchId = idArgument[0][1];

		const api = {} // new{} MatchApi();
		this.intervalId = setInterval(() => {
			api.getMatch(this.props.matchId, (hTeam, aTeam, score) => {
				this.setState({
					hometeam: hTeam,
					awayteam: aTeam,
					score
				});
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

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
}
