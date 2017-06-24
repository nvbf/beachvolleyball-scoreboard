import React from "react";
import firebase from "firebase";
import { init } from "../src/util/auth";
import { getTournament } from "../src/firebase";
import { transformToCorrectState } from "../src/domain/tide/storage";

// import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { Card, CardActions, CardHeader, CardText } from "material-ui";

import {
  constants as c,
  Match,
  MATCH_FIREBASE_KEY
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
import component from "react-toggle";

class Tournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: {},
      loading: true
    };
  }

  componentDidMount() {
    init();
    firebase
      .database()
      .ref(c.MATCH_PATH)
      .orderByChild("tournamentId")
      .equalTo(this.props.tournament.privateId)
      .on("value", matches => {
        this.setState({
          matches: matches.val(),
          loading: false
        });
      });
  }

  render() {
    const { tournament } = this.props;
    const matchesHtml = this.state.matches
      ? <div>{listMatches(this.state.matches)}</div>
      : <div>No Matches in tournament</div>;
    const componentToShow = this.state.loading
      ? <div>Loading ... </div>
      : matchesHtml;
    return (
      // <MuiThemeProvider>
      <div>
        <h1>{tournament.name}</h1>
        {componentToShow}
      </div>
      //</MuiThemeProvider>
    );
  }
}

Tournament.getInitialProps = async context => {
  const slug = context.query.slug;
  const tournamentInfo = await getTournament(slug);
  console.log("tournamentInfo", tournamentInfo);
  return tournamentInfo;
};

function showScore(match = {}) {
  const complete = false;

  const firstSet = getScoreFromFirstSet(match);
  const secondSet = getScoreFromSecondSet(match);
  const thirdSet = getScoreFromThirdSet(match);
  const setResult = getSetResult(match);
  const isFinished = isMatchFinished(match);
  const pointsInCurrentSet = getPointsInCurrentSetAsString(match);
  const scoreInCompletedSet = getScoreForCompletedSets(match);

  return <span>{firstSet}, {secondSet}, {thirdSet}</span>;
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
  console.log(matches);
  return Object.keys(matches)
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
          {match.b1Player} / {match.b2Player}: {" "}
          {showScore(match.match)} ({match.matchKey})
        </div>
      );
    });
}

export default Tournament;
