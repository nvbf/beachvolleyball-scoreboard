import React from "react";

import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";

export default function({
  h1Player,
  h2Player,
  b2Player,
  b1Player,
  setsWonByAwayTeam,
  setsWonByHomeTeam,
  isFinished,
  pointsInCurrentSet,
  scoreInCompletedSet,
  winner
}) {
  const showMainInfo = winner
    ? <div className="set-score">
        {setsWonByHomeTeam} - {setsWonByAwayTeam}
      </div>
    : <div className="current-score">
        {pointsInCurrentSet.join(" - ")}
      </div>;

  const compSets = scoreInCompletedSet.split(",");
  const setsJsx = compSets.map((score, i) =>
    <span key={i}>
      {score}
    </span>
  );

  return (
    <div className="live-card">
      <div className="live-matches">
        <div className="container">
          <div className="team">
            <div>
              {h1Player}
            </div>
            <div>
              {h2Player}
            </div>
          </div>
        </div>

        <div className="container container-center">
          <div className="score-container">
            {showMainInfo}
            <div>
              {setsJsx}
            </div>
          </div>
        </div>
        <div className="container container-right">
          <div className="team away-team">
            <div>
              {b1Player}
            </div>
            <div>
              {b2Player}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
