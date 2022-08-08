import React from "react";
import Link from "next/link";

import {CircularProgress, List, ListItem, ListItemText} from "@material-ui/core";

import ActionAssignment from "@material-ui/icons/assignment";
import ActionDelete from "@material-ui/icons/delete";
import { getMyTournaments } from "../src/firebase";
import { startAnonymousAuth, addObserverOnLoginStatus } from "../src/util/auth";


class TournamentsPage extends React.Component {
  state = {};

  async componentDidMount() {
    const tournaments = await getMyTournaments();
    console.log("my tournaments", tournaments);
    this.setState({ tournaments });
  }

  render() {
    const { tournaments } = this.state;

    if (!tournaments) {
      return (
          <main>
            <CircularProgress mode="indeterminate" />
          </main>
      );
    }

    return (
        <main>
          <h1>Tournaments</h1>
          {listTournaments(tournaments)}
        </main>
    );
  }
}

function listTournaments(tournaments = {}) {
  console.log("listTournaments", tournaments);
  const formattedList = Object.keys(tournaments).map(tournamentKey => {
    const tournament = tournaments[tournamentKey];
    const toMatches = <ActionAssignment style="" />;
    const tournamentName = (
      <h2>
        {tournament.name}
      </h2>
    );
    return (
      <Link
        key={tournament.slug}
        href={`/tournament/?slug=${tournament.slug}`}
        as={`/tournament/${tournament.slug}`}
      >
        <ListItem primaryText={tournamentName} rightIcon={toMatches}>
          <ListItemText primary={tournamentName} />
          <ActionDelete />
          {/* TODO: how to get this on the same line, or get a good UX on this, delete button does not work*/}
          privateId: {tournament.privateId}
        </ListItem>
      </Link>
    );
  });

  if (Object.keys(tournaments).length > 0) {
    return (
      <List>
        {formattedList}
      </List>
    );
  }
  return (
    <p>
      No tournaments found.{" "}
      <Link href="/create-tournament" as="/create-tournament">
        <a href="">Create a tournament</a>
      </Link>
    </p>
  );
}

export default TournamentsPage;
