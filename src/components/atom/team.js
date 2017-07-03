import React from "react";
import Label from "./team-color-label";

function Team({ color, player1, player2 }) {
  const rgb = color.slice(1);
  const teamId = `team-${rgb}`;
  return (
    <span name={teamId}>
      <Label color={color} /> {player1} - {player2}
    </span>
  );
}

export default Team;
