import React from "react";
import firebase from "firebase";
import component from "react-toggle";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { init } from "../src/util/auth";
import { getTournament, matchesFromTournament } from "../src/firebase";
import { transformToCorrectState } from "../src/domain/tide/storage";

import {
  constants as c,
  Match,
  MATCH_FIREBASE_KEY,
  WINNER
} from "../src/domain/tide/state";

// TODO; put into head     <meta name="viewport" content="width=device-width, initial-scale=1">

class Tournament extends React.Component {
  constructor(props) {
    super(props);
    this.loadTournamentData = this.loadTournamentData.bind(this);
  }

  state = {
    loading: true
  };

  componentDidMount() {
    this.loadTournamentData();
  }

  async loadTournamentData() {
    const slug = document.location.pathname.split("/")[2];
    const tournament = await getTournament(slug);
    this.setState({
      tournament: tournament,
      loading: false
    });

    matchesFromTournament(tournament.privateId, this.setState.bind(this));
  }

  render() {
    const { tournament, loading } = this.state;
    if (!tournament && loading === false) {
      console.log("tournament er tom?", this.state);
      return <p>Turnering ikke funnet</p>;
    }

    const TournamentName = tournament
      ? <h1>
          {tournament.name}
        </h1>
      : null;

    const matchesHtml = this.state.matches
      ? <div>
          {listMatches(this.state.matches)}
        </div>
      : <div>No Matches in tournament</div>;
    const componentToShow = this.state.loading
      ? <div>
          <p>Loading ... </p>
        </div>
      : matchesHtml;
    return (
      <MuiThemeProvider>
        <div>
          {TournamentName}
          <div className="tournament-container">
            {componentToShow}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

function showScore(scoreInCompletedSet) {
  return (
    <span>
      {scoreInCompletedSet}
    </span>
  );
}

function compare(a, b) {
  if (a.matchId < b.matchId) return -1;
  if (a.matchId > b.matchId) return 1;
  return 0;
}

const cardTextStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  color: "#333"
};

const homeContainer = {
  fontWeight: "bold",
  fontSize: "1.5em",
  flexGrow: "1"
};

const scoreStyle = {
  flexGrow: "2"
};

function listMatches(matches) {
  if (matches === undefined || matches === null) {
    return;
  }
  const liveMatches = Object.keys(matches)
    .filter(matchIsLive)
    .map(matchKey => {
      const match = matches[matchKey];
      return match;
    })
    .sort(compare)
    .map(match => {
      return (
        <div key={match.matchId}>
          {match.matchId}: {match.h1Player} / {match.h2Player} -{" "}
          {match.b1Player} / {match.b2Player}:{" "}
          {showScore(match.scoreInCompletedSet)} ({match.matchKey})
        </div>
      );
    });

  const finshedMatchesHtml = Object.keys(matches)
    .filter(matchIsFinished)
    .map(matchKey => {
      const match = matches[matchKey] || {};
      console.log("c", c);
      console.log("match", match);
      const rowClassName =
        match.winner == c.HOMETEAM ? "winner-home" : "winner-away";
      return (
        <tr key={match.matchId} className={rowClassName}>
          <td class="teams">
            <span class="home-team">
              {match.h1Player}/{match.h2Player}
            </span>
            vs
            <span class="away-team">
              {match.b1Player}/{match.b2Player}
            </span>
          </td>
          <td class="sets">
            <span class="home-team">
              {match.setsWonByHomeTeam}
            </span>
            <span class="away-team">
              {match.setsWonByAwayTeam}
            </span>
          </td>
          <td class="score">
            <span>
              {match.scoreInCompletedSet}
            </span>
          </td>
        </tr>
      );
    });

  return (
    <section>
      {liveMatches}
      <table>
        <thead>
          <tr>
            <th>Teams</th>
            <th>Set</th>
            <th>
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </th>
          </tr>
        </thead>
        <tbody />
      </table>
      {finshedMatchesHtml}
    </section>
  );
}

function matchIsLive(match) {
  return !match.IsFinished;
}

function matchIsFinished(match) {
  return match.IsFinished;
}

export default Tournament;
