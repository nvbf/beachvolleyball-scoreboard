import React from "react";
import firebase from "firebase";
import { init } from "../src/util/auth";
import { getTournament } from "../src/firebase";
import { transformToCorrectState } from "../src/domain/tide/storage";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";

import { constants as c, Match } from "../src/domain/tide/state";

import {
  isMatchFinished,
  getScoreFromFirstSet,
  getScoreFromSecondSet,
  getScoreFromThirdSet,
  getSetResult,
  getPointsInCurrentSetAsString,
  getScoreForCompletedSets
} from "../src/domain/tide/logic";

class Tournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: {}
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
          matches: matches.val()
        });
      });
  }

  render() {
    const { tournament } = this.props;
    return (
      <MuiThemeProvider>
        <div>
          <h1>{tournament.name}</h1>
          <h3> Matches </h3>
          <div>{listMatches(this.state.matches)}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Tournament.getInitialProps = async params => {
  const slug = params.asPath.split("/")[2];
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

  const endGameSets = {
    fontSize: "2.5em",
    color: "#333",
    textAlign: "center"
  };

  const currentPlayedSetsScore = {
    textAlign: "center"
  };

  if (isFinished) {
    return (
      <div>
        <div style={endGameSets}>
          {setResult}
        </div>
        <div style={currentPlayedSetsScore}>
          {firstSet}, {secondSet}, {thirdSet}
        </div>
      </div>
    );
  }

  const currentScoreStyle = {
    fontSize: "2.5em",
    color: "red",
    textAlign: "center"
  };

  return (
    <div>
      <div style={currentScoreStyle}>
        {pointsInCurrentSet}
      </div>
      <div style={currentPlayedSetsScore}>{scoreInCompletedSet}</div>
    </div>
  );
}

function listMatches(matches) {
  if (matches === undefined || matches === null) {
    return;
  }
  console.log(matches);
  return Object.keys(matches).map(matchKey => {
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

    return (
      <Card key={matchKey}>
        <CardText style={cardTextStyle}>
          <div style={homeContainer}>
            <div>{h1Player}</div>
            <div>{h2Player}</div>
          </div>
          <div style={scoreStyle}>
            {showScore(match)}

          </div>
          <div style={homeContainer}>
            <div>{b1Player}</div>
            <div>{b2Player}</div>
          </div>
          <div>matchid: {matchId}</div>
        </CardText>
      </Card>
    );
  });
}

export default Tournament;
