import React from "react";
import firebase from "firebase";
import component from "react-toggle";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { init } from "../src/util/auth";
import { observeTournament } from "../src/firebase";
import { transformToCorrectState } from "../src/domain/tide/storage";

import {
  constants as c,
  Match,
  MATCH_FIREBASE_KEY,
  WINNER
} from "../src/domain/tide/state";

import {
  isMatchFinished,
  getScoreFromFirstSet,
  getScoreFromSecondSet,
  getScoreFromThirdSet,
  getSetResult,
  getPointsInCurrentSetAsString,
  getScoreForCompletedSets
} from "../src/domain/tide/logic";

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

  loadTournamentData() {
    const slug = document.location.pathname.split("/")[2];
    const observe = value => {
      this.setState({
        tournament: value,
        loading: false
      });
    };
    observeTournament(slug, observe);
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

function showScore(match = {}) {
  const complete = false;

  const firstSet = getScoreFromFirstSet(match);
  const secondSet = getScoreFromSecondSet(match);
  const thirdSet = getScoreFromThirdSet(match);
  const setResult = getSetResult(match);

  return (
    <span>
      {firstSet}, {secondSet}, {thirdSet}
    </span>
  );
}

function compare(a, b) {
  if (a.matchId < b.matchId) return -1;
  if (a.matchId > b.matchId) return 1;
  return 0;
}

function listMatches(matches) {
  if (matches === undefined || matches === null) {
    return;
  }
  const liveMatches = Object.keys(matches)
    .filter(matchIsLive)
    .map(matchKey => {
      console.log("matchKey", matchKey);
      console.log("matches[matchKey]", matches[matchKey]);
      const asJson = JSON.parse(matches[matchKey].match);
      console.log("asJson", asJson);
      const state = transformToCorrectState(asJson);
      console.log("state", state);
      const match = state[c.MATCH];
      console.log("match", match);

      const h1Player = match[c.HOMETEAM_FIRST_PLAYER_NAME];
      const h2Player = match[c.HOMETEAM_SECOND_PLAYER_NAME];
      const b1Player = match[c.AWAYTEAM_FIRST_PLAYER_NAME];
      const b2Player = match[c.AWAYTEAM_SECOND_PLAYER_NAME];

      const h1Points = match[c.FIRST_SET][c.HOMETEAM_POINT];
      const b1Points = match[c.FIRST_SET][c.AWAYTEAM_POINT];
      const h2Points = match[c.SECOND_SET][c.HOMETEAM_POINT];
      const b2Points = match[c.SECOND_SET][c.AWAYTEAM_POINT];
      const h3Points = match[c.THIRD_SET][c.HOMETEAM_POINT];
      const b3Points = match[c.THIRD_SET][c.AWAYTEAM_POINT];

      const matchId = match[c.MATCH_ID];

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
      return {
        matchId,
        h1Player,
        h2Player,
        b1Player,
        b2Player,
        match,
        matchKey
      };
    })
    .sort(compare)
    .map(match => {
      return (
        <div>
          {match.matchId}: {match.h1Player} / {match.h2Player} -{" "}
          {match.b1Player} / {match.b2Player}: {showScore(match.match)} ({match.matchKey})
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
        match[c.WINNER] == c.HOMETEAM ? "winner-home" : "winner-away";
      const player1 = match[c.HOMETEAM_FIRST_PLAYER_NAME];
      const player2 = match[c.HOMETEAM_SECOND_PLAYER_NAME];
      const player3 = match[c.AWAYTEAM_FIRST_PLAYER_NAME];
      const player4 = match[c.AWAYTEAM_SECOND_PLAYER_NAME];
      const setsAway = match[c.SETS_AWAYTEAM];
      const setsHome = match[c.HOMETEAM];
      const sets = match[c.POINTS_IN_SETS];
      return (
        <tr className={rowClassName}>
          <td class="teams">
            <span class="home-team">
              {player1}/{player2}
            </span>
            vs
            <span class="away-team">
              {player3}/{player4}
            </span>
          </td>
          <td class="sets">
            <span class="home-team">
              {setsHome}
            </span>
            <span class="away-team">
              {setsAway}
            </span>
          </td>
          <td class="score">
            <span>
              {sets}
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

function matchIsLive(math) {
  return false;
}

function matchIsFinished(math) {
  return true;
}

export default Tournament;
