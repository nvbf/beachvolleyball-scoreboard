import React from "react";
import firebase from "firebase";
import component from "react-toggle";
import Head from "next/head";

import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { init } from "../src/util/auth";
import { getTournament, matchesFromTournament } from "../src/firebase";
import { transformToCorrectState } from "../src/domain/tide/storage";
import LiveMatches from "../src/components/components/LiveMatches";

import {
  constants as c,
  Match,
  MATCH_FIREBASE_KEY,
  WINNER
} from "../src/domain/tide/state";
import FinishedMatches from "../src/components/components/FinishedMatches";

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

    const Styles = (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <style jsx global>{`
          body {
            font-family: Roboto, Helvetica Neue, Arial;
          }

          .tournament-container {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
            padding: 4px;
          }

          .tournament-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .main-menu {
            z-index: 3;
            height: 56px;
            line-height: 56px;
            background-color: #09c;
          }
          .main-menu a {
            color: white;
            text-decoration: none;
            font-size: 24px;
          }
          .main-menu > ul {
            list-style: none;
            padding: 0;
            margin: 0;
            text-transform: uppercase;
            max-width: 960px;
            margin-left: auto;
            margin-righT: auto;
            /*
                > li:hover {
                    background-color: #555;
                }

                > li:hover a {
                    color: white;
                }

                > li:hover ul {
                    display: block;
                }
                */
          }
          .main-menu > ul > li {
            display: inline-block;
            padding-right: 5px;
            padding-left: 10px;
            border-right: 1px solid #0489b5;
            vertical-align: top;
          }
          .main-menu > ul > li > ul {
            display: none;
            background-color: #555;
            color: white;
            line-height: 24px;
            padding: 5px;
          }
          .main-menu > ul > li > ul a {
            color: white;
            font-size: 16px;
            display: block;
            padding: 3px;
          }
          .main-menu > ul > li > ul li:hover {
            background-color: white;
          }
          .main-menu > ul > li > ul li:hover a {
            color: #555;
          }

          .matches-table {
            border: 2px solid #555;
            width: 100%;
            font-size: 20px;
            padding: 0;
          }
          @media screen and (max-width: 450px) {
            .matches-table {
              font-size: 14px;
            }
          }
          .matches-table thead {
            background-color: #555;
            color: white;
          }
          .matches-table thead th.sets {
            text-align: left;
            width: 130px;
          }
          .matches-table thead th.sets span {
            display: inline-block;
            width: 30%;
            text-align: center;
          }
          .matches-table td {
            padding: 10px;
            border-bottom: 1px solid #edebeb;
          }
          .matches-table tr:nth-child(even) td {
            background: #f6f5f5 !important;
          }
          .matches-table .sets {
            text-align: center;
            white-space: nowrap;
            margin: 0.8em;
          }
          .matches-table .score {
            font-size: 14px;
            white-space: nowrap;
          }
          .matches-table .score span {
            width: 33%;
            padding-right: 0.4em;
            text-align: center;

          }
          .matches-table .teams {
            max-width: 60%;
          }
          .matches-table .winner-home span.home-team {
            color: #09c;
          }
          .matches-table .winner-away span.away-team {
            color: #09c;
          }

          .live-card {
            padding: 10px;
          }
          .live-card .live-matches .container {
            width: 32%;
            display: inline-block;
          }
          .live-card .live-matches .center-container {
            text-align: center;
          }
          .live-card .live-matches .right-container {
            text-align: right;
          }
          .live-card .live-matches > div {
            display: inline-block;
            margin-left: auto;
            margin-right: auto;
          }
          .live-card .team {
            font-size: 32px;
            text-align: left;
          }
          @media screen and (max-width: 450px) {
            .live-card .team {
              font-size: 14px;
            }
          }
          .live-card .away-team {
            text-align: right;
          }
          .live-card .current-score {
            background-color: red;
            color: white;
            padding: 5px 10px 5px 10px;
            font-size: 24px;
            border-radius: 2px;
            display: inline-block;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 10px;
            white-space: nowrap;
          }
          @media screen and (max-width: 450px) {
            .live-card .current-score {
              font-size: 16px;
            }
          }
          .live-card .set-score {
            background-color: black;
            color: white;
            padding: 5px 10px 5px 10px;
            font-size: 24px;
            border-radius: 2px;
            display: inline-block;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 10px;
          }
          .live-card .score-container {
            text-align: center;
            font-size: 14px;
            white-space: nowrap;
          }
        `}</style>
      </div>
    );

    const TournamentName = tournament
      ? <div className="main-menu">
          {Styles}
          <ul>
            <li>
              <a href="#">
                {tournament.name}
              </a>
            </li>
          </ul>
        </div>
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

function listMatches(matches) {
  if (matches === undefined || matches === null) {
    return;
  }

  const liveMatches = Object.keys(matches)
    .map(matchKey => matches[matchKey])
    .filter(match => !match.isFinished)
    .sort(compareMatchId);

  const finshedMatchesHtml = Object.keys(matches)
    .map(matchKey => matches[matchKey])
    .filter(match => match.isFinished)
    .sort(compareTimeFinished);

  return (
    <section>
      <LiveMatches matches={liveMatches} />
      <FinishedMatches matches={finshedMatchesHtml} />
    </section>
  );
}

function compareMatchId(a, b) {
  if (a.matchId < b.matchId) return -1;
  if (a.matchId > b.matchId) return 1;
  return 0;
}

function compareTimeFinished(a, b) {
  if (a.timeFinished < b.timeFinished) return 1;
  if (a.timeFinished > b.timeFinished) return -1;
  return 0;
}

export default Tournament;
