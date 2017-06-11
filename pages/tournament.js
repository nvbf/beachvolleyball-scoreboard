import React from "react";
import { getTournament } from "../src/firebase";
import {
  constants as c,
  HOMETEAM_FIRST_PLAYER_NAME
} from "../src/domain/tide/state";

const Tournament = ({ name, slug, matches = [] }) =>
  <div>
    <h1>{name}</h1>
    <h3> Matches </h3>
    <ul>
      <ul>{listMatches(matches)}</ul>
    </ul>
  </div>;

Tournament.getInitialProps = async params => {
  const slug = params.asPath.split("/")[2];
  const tournamentInfo = await getTournament(slug);
  console.log("tournamentInfo", tournamentInfo);
  return tournamentInfo;
};

function listMatches(matches = []) {
  console.log("matches", matches);
  return Object.keys(matches).map(matchKey => {
    const match = JSON.parse(matches[matchKey].match);
    const h1Player = match[c.MATCH][c.HOMETEAM_FIRST_PLAYER_NAME];
    const h2Player = match[c.MATCH][c.HOMETEAM_SECOND_PLAYER_NAME];
    const b1Player = match[c.MATCH][c.AWAYTEAM_FIRST_PLAYER_NAME];
    const b2Player = match[c.MATCH][c.AWAYTEAM_SECOND_PLAYER_NAME];

    const h1Points = match[c.MATCH][c.FIRST_SET][c.HOMETEAM_POINT];
    const b1Points = match[c.MATCH][c.FIRST_SET][c.AWAYTEAM_POINT];
    const h2Points = match[c.MATCH][c.FIRST_SET][c.HOMETEAM_POINT];
    const b2Points = match[c.MATCH][c.FIRST_SET][c.AWAYTEAM_POINT];
    const h3Points = match[c.MATCH][c.FIRST_SET][c.HOMETEAM_POINT];
    const b3Points = match[c.MATCH][c.FIRST_SET][c.AWAYTEAM_POINT];
    return (
      <li>
        {h1Player} and {h2Player} vs {b1Player} and
        {" "}{h2Player}}, {h1Points}
        {" "}- {b1Points},
        {" "}{h2Points} - {b2Points},
        {" "}{h3Points} - {b3Points}
      </li>
    );
  });
}

export default Tournament;
