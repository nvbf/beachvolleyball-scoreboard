import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import Label from "../atom/team-color-label";

export default class ScoreboardRow extends Component {
  render() {
    const {
      score1,
      score2,
      score3,
      matchFinished,
      addPoint,
      TeamComponent
    } = this.props;

    return (
      <tr>
        <td>
          <TeamComponent />
        </td>
        <td>{score1}</td>
        <td>{score2}</td>
        <td>{score3}</td>
        <td>
          <Button
            bsStyle="primary"
            className="points"
            type="submit"
            onClick={addPoint}
            disabled={matchFinished}
          >
            <span
              className="glyphicon glyphicon-plus-sign"
              aria-hidden="true"
            />
          </Button>
        </td>
      </tr>
    );
  }
}

ScoreboardRow.propTypes = {
  TeamComponent: PropTypes.func.isRequired,
  score1: PropTypes.number.isRequired,
  score2: PropTypes.number.isRequired,
  score3: PropTypes.number.isRequired,
  matchFinished: PropTypes.bool.isRequired,
  addPoint: PropTypes.func.isRequired
};
