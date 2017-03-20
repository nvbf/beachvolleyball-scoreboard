import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class ScoreboardRow extends Component {

	render() {
		const players = this.props.team;
		const score = this.props.scoreForThisTeam;

		return (
			<tr>
				<td>
					{players.player1}					- {players.player2}
				</td>
				<td>
					{score[0]}
				</td>
				<td>
					{score[1]}
				</td>
				<td>
					{score[2]}
				</td>
				<td>
					<Button
						bsStyle="primary" className="points" type="submit" onClick={this.props.pointsToTeam}
						disabled={this.props.match.state.finished}
					>
						<span className="glyphicon glyphicon-plus-sign" aria-hidden="true"/>
					</Button>
				</td>
				<td>
					<Button
						bsStyle="warning" className="points" type="submit" onClick={this.props.removePoint}
						disabled={this.props.match.state.finished}
					>
						<span className="glyphicon glyphicon-plus-sign" aria-hidden="true"/>
					</Button>
				</td>
			</tr>
		);
	}
}

ScoreboardRow.propTypes = {
	team: React.PropTypes.object.isRequired,
	scoreForThisTeam: React.PropTypes.array.isRequired,
	pointsToTeam: React.PropTypes.func.isRequired,
	removePoint: React.PropTypes.func.isRequired
};
