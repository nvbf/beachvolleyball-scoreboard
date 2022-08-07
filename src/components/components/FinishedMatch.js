import React from "react";


import { constants as c } from "../../domain/tide/state";

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
  const winnerStyle = winner === c.HOMETEAM ? "winner-home" : "winner-away";
  const compSets = scoreInCompletedSet.split(",");
  const setsJsx = compSets.map((score, i) =>
    <span key={i}>
      {score}
    </span>
  );

  return (
    <tr className={winnerStyle}>
      <td className="teams">
        <span className="home-team">
          {name(h1Player)}/{name(h2Player)}
        </span>
        {' '}vs{' '}
        <span className="away-team">
          {name(b1Player)}/{name(b2Player)}
        </span>
      </td>
      <td className="sets">
        <span className="home-team">{setsWonByHomeTeam}</span> -{" "}
        <span className="away-team">{setsWonByAwayTeam}</span>
      </td>
      <td className="score">
        {setsJsx}
      </td>
    </tr>
  );
}

function name(input) {
  input = input || "";
  var out = "";

  var words = input.trim().split(/[ ]+/g);
  for (var i = 0; i < words.length; i++) {
    if (i < words.length - 1) {
      out += words[i][0].toUpperCase() + ". ";
    } else {
      out += words[i];
    }
  }

  return out;
}
