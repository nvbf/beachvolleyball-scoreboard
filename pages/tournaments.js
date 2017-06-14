import React from "react";

import Link from "next/link";

import { getTournaments } from "../src/firebase";

class TournamentsPage extends React.Component {
  render() {
    const { tournaments } = this.props;

    return (
      <main>
        <h1>Tournaments</h1>
        <ul>
          {listTournaments(tournaments)}
        </ul>
      </main>
    );
  }
}

TournamentsPage.getInitialProps = async () => {
  const tournaments = await getTournaments();
  return { tournaments };
};

function listTournaments(tournaments = []) {
  console.log("tournaments", tournaments);
  return Object.keys(tournaments).map(tournamentKey => {
    const tournament = tournaments[tournamentKey];
    console.log("tournament", tournament);
    return (
      <li key={tournamentKey}>
        <Link
          href={`/tournament/?slug=${tournament.publicId}`}
          as={`/tournament/${tournament.publicId}`}
        >
          <a>{tournament.name}</a>
        </Link>
      </li>
    );
  });
}

export default TournamentsPage;
