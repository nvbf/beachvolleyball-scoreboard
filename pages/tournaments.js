import React from "react";
import Link from "next/link";
import { List, ListItem } from "material-ui/List";

import ActionAssignment from "material-ui/svg-icons/action/assignment";
import ActionDelete from "material-ui/svg-icons/action/delete";
import { red500, yellow500, blue500 } from "material-ui/styles/colors";

import { getMyTournaments } from "../src/firebase";
import { startAnonymousAuth, addObserverOnLoginStatus } from "../src/util/auth";
import CircularProgress from "material-ui/CircularProgress";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class TournamentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      loading: true
    };
  }

  render() {
    console.log(this.state);
    const { tournaments, loading } = this.state;

    if (loading) {
      return (
        <MuiThemeProvider>
          <main>
            <h1>Tournaments</h1>
            <CircularProgress mode="indeterminate" />
          </main>
        </MuiThemeProvider>
      );
    }

    return (
      <MuiThemeProvider>
      <main>
        <h1>Tournaments</h1>
        {listTournaments(tournaments)}
      </main>
      </MuiThemeProvider>
    );
  }

  componentDidMount() {
    const setTournamentsAstate = tournaments => {
      console.log('setstate:', tournaments)
      this.setState({
        tournaments: tournaments,
        loading: false
      });
    };
    getTournamentWhenLoggedIn(setTournamentsAstate);
    startAnonymousAuth();
  }
}

function getTournamentWhenLoggedIn(setTournamentsAstate) {
  addObserverOnLoginStatus(() => {
    getMyTournaments()
      .then(tournaments => setTournamentsAstate(tournaments))
      .catch(err => console.log("error getTournamentWhenLoggedIn", err));
  });
}

const iconStyles = {
  marginRight: 24
};

function listTournaments(tournaments = {}) {
  console.log('listTournaments', tournaments);
  const formattedList = Object.keys(tournaments).map(tournamentKey => {
    const tournament = tournaments[tournamentKey];
    const toMatches = <ActionAssignment style={iconStyles} />
    const tournamentName = <h2>{tournament.name}</h2>
    return (
        <Link
          key={tournament.publicId}
          href={`/tournament/?slug=${tournament.publicId}`}
          as={`/tournament/${tournament.publicId}`}
          >
          <ListItem primaryText={tournamentName} rightIcon={toMatches} >
          <ActionDelete /> 
          {/* TODO: how to get this on the same line, or get a good UX on this, delete button does not work*/}
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
      <Link href="/tournament/create" as="/tournament/create">
        <a href="">Create a tournament</a>
      </Link>
    </p>
  );
}

export default TournamentsPage;
