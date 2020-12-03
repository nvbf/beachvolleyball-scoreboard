import React, { Component } from "react";
import { wrap } from "tide";

import ScoreboardRow from "../molokyler/scoreboard-row";
import ServiceOrderButton from "./../molokyler/service-order-button";
import AddCommentButton from "./../molokyler/add-comments-button";
import InfoArea from "./../molokyler/info-area";
import MatchDetails from "./../match-details";

import Timeout from "../timeout";
import TimeoutButtons from "../timeout-buttons";
import AwayTeam from "../molokyler/away-team";
import HomeTeam from "../molokyler/home-team";
import AddEmailButton from "../molokyler/add-email-button";
import AddTournamentIdButton from "../molokyler/add-tournamentid-button";
import AlertInfo from "../atom/alert-info";
import ScoreboardVisual from "./scoreboardVisual"

import styled from 'styled-components';

import {
  Button,
  ButtonToolbar,
  Alert,
  PanelGroup,
  Panel
} from "react-bootstrap";

import {
  MATCH,
  HOMETEAM_FIRST_PLAYER_NAME,
  HOMETEAM_SECOND_PLAYER_NAME,
  AWAYTEAM_FIRST_PLAYER_NAME,
  AWAYTEAM_SECOND_PLAYER_NAME,
  FIRST_SET,
  SECOND_SET,
  THIRD_SET,
  AWAYTEAM_POINT,
  HOMETEAM_POINT,
  MATCH_IS_FINISED,
  ACTION_HISTORY,
  constants as c
} from "../../domain/tide/state";

const ScoreBoardBackground = styled.div`
  position: relative;
  left: 0;
  top: 0;
   width: 100%;
   height: 30vh;
   background-image: url(/static/img/Asset1.png);
   background-size: 100% 100%;
`;

class Scoreboard extends Component {
  constructor(props) {
    super(props);
    this.state = { showDetails: false };
  }

  handleDetailToogle() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  render() {
    const {
      HOMETEAM_SECOND_PLAYER_NAME,
      HOMETEAM_FIRST_PLAYER_NAME,
      AWAYTEAM_SECOND_PLAYER_NAME,
      AWAYTEAM_FIRST_PLAYER_NAME,
      MATCH_IS_FINISED,
      ACTION_HISTORY,
      SECOND_SET,
      THIRD_SET,
      h1p,
      a1p,
      h2p,
      a2p,
      h3p,
      a3p
    } = this.props;

    console.log("rendering:");

    const newMatchUrl = "/match?new=true";

    return (
      <div>
        <div className="container scoreboard">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">Match standing</h2>
            </div>
            <div className="panel-body">
              <div width="100%" height="100px">
                <ScoreBoardBackground>
                    <ScoreboardVisual 
                      addPointHome={this.props.tide.actions.all.addPointHometeam}
                      addPointAway={this.props.tide.actions.all.addPointAwayteam}
                      matchFinished={MATCH_IS_FINISED}
                      />
                </ScoreBoardBackground>
              </div>
            </div>
            <div className="panel-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <td>Teams</td>
                    <td>Set 1</td>
                    <td>Set 2</td>
                    <td>Set 3</td>
                    <td>Undo</td>
                  </tr>
                </thead>
                <tbody>
                  <ScoreboardRow
                    addPoint={this.props.tide.actions.all.addPointHometeam}
                    score1={h1p}
                    score2={h2p}
                    score3={h3p}
                    TeamComponent={HomeTeam}
                    matchFinished={MATCH_IS_FINISED}
                  />
                  <ScoreboardRow
                    addPoint={this.props.tide.actions.all.addPointAwayteam}
                    score1={a1p}
                    score2={a2p}
                    score3={a3p}
                    TeamComponent={AwayTeam}
                    matchFinished={MATCH_IS_FINISED}
                  />
                </tbody>
              </table>
            </div>
            <div className="panel-footer">
              <TimeoutButtons />
            </div>
          </div>
          <section>
            <Alert bsStyle="warning">
              <ButtonToolbar>
                <ServiceOrderButton />
                <AddCommentButton />
              </ButtonToolbar>
            </Alert>
          </section>

          <PanelGroup accordion>
            <Panel header="Details ⭢" eventKey="1">
              <MatchDetails
                events={ACTION_HISTORY}
                showDetails={this.state.showDetails}
                handleDetailToogle={this.handleDetailToogle.bind(this)}
              />
            </Panel>
            <Panel header="Settings ⭢" eventKey="2">
              <a href={newMatchUrl}>New match</a>
              <AddEmailButton />
              <AddTournamentIdButton />
            </Panel>
            <Panel header="Notes for first time users ⭢" eventKey="3">
              <InfoArea number={"?"}>
                This scoreboard should be so easy to use and help you in all the
                parts of the scoreboard
                process so that it's no need for more people then the referee
              </InfoArea>
              <InfoArea number={"?"}>
                You can set the service order by clicking the "Set service
                order" button above. (Optional)
                When you have set the service order, we will help you keep track
                of how is serving.
              </InfoArea>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    );
  }
}

export default wrap(Scoreboard, {
  [HOMETEAM_FIRST_PLAYER_NAME]: [MATCH, HOMETEAM_FIRST_PLAYER_NAME],
  [HOMETEAM_SECOND_PLAYER_NAME]: [MATCH, HOMETEAM_SECOND_PLAYER_NAME],
  [AWAYTEAM_FIRST_PLAYER_NAME]: [MATCH, AWAYTEAM_FIRST_PLAYER_NAME],
  [AWAYTEAM_SECOND_PLAYER_NAME]: [MATCH, AWAYTEAM_SECOND_PLAYER_NAME],
  [MATCH_IS_FINISED]: [MATCH, MATCH_IS_FINISED],
  [ACTION_HISTORY]: ACTION_HISTORY,
  h3p: [MATCH, THIRD_SET, HOMETEAM_POINT],
  a3p: [MATCH, THIRD_SET, AWAYTEAM_POINT],
  h2p: [MATCH, SECOND_SET, HOMETEAM_POINT],
  a2p: [MATCH, SECOND_SET, AWAYTEAM_POINT],
  h1p: [MATCH, c.FIRST_SET, c.HOMETEAM_POINT],
  a1p: [MATCH, c.FIRST_SET, c.AWAYTEAM_POINT]
});

//	[FIRST_SET]: [MATCH, FIRST_SET],
//
