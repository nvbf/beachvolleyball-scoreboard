import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import Label  from '../atom/team-color-label'

export default class ScoreboardRow extends Component {

	render() {
		const {
			player1,
			player2,
			score1,
			score2,
			score3,
			teamColor,
			matchFinished,
			addPoint
		}  = this.props;
		// const style = this.props.teamColor ? { backgroundColor: hexToRGBA(this.props.teamColor) } : {}
		return (
			<tr>
				<td>
					<Label color={teamColor} />  {player1} - {player2}
				</td>
				<td>
					{score1}
				</td>
				<td>
					{score2}
				</td>
				<td>
					{score3}
				</td>
				<td>
					<Button
						bsStyle="primary" className="points" type="submit" onClick={addPoint}
						disabled={matchFinished}
					>
						<span className="glyphicon glyphicon-plus-sign" aria-hidden="true"/>
					</Button>
				</td>
			</tr>
		);
	}
}

ScoreboardRow.propTypes = {
	player1: React.PropTypes.string.isRequired,
	player2: React.PropTypes.string.isRequired,
	score1: React.PropTypes.number.isRequired,
	score2: React.PropTypes.number.isRequired,
	score3: React.PropTypes.number.isRequired,
	teamColor: React.PropTypes.string.isRequired,
	matchFinished: React.PropTypes.bool.isRequired,
	addPoint: React.PropTypes.func.isRequired,
};
