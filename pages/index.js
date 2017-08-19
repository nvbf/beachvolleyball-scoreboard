import React from "react";
import Link from "next/link";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
  CardMedia,
  CardTitle
} from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import AppBarMain from "../src/components/components/appbar";

import styled from "styled-components";

const StyledCard = styled(Card)`
  margin: 1rem;
   cursor: pointer;
`;

export default () => {
  return (
    <MuiThemeProvider>
      <div>
        <AppBarMain />
        <div>
          <ul>
            <li>Do you need an electronically beachvolleyball scoresheet? </li>
            <li>Do you want livescore on your game? </li>
            <li>
              Do you want the scoresheet to remember, switch, technical timeouts
              and everything else that is hard to remebmer?
            </li>
          </ul>
          <p>
            {" "}We offer you all of the above for free! You can also create a
            tournament with livescore{" "}
          </p>
          <p>
            {" "}PS: want to go hardcore and setup streaming also? see{" "}
            <a href="https://volleystream.no">Volleystream.no</a>{" "}
          </p>
        </div>
        <main>
          <StyledCard>
            <Link href="/match">
              <CardMedia
                overlay={
                  <CardTitle
                    title="New match"
                    subtitle="Electronic scoresheet, no need for an seperate scorer."
                  />
                }
              >
                <img src="static/img/match.jpg" alt="Beacvolleyballcourt" />
              </CardMedia>
            </Link>
          </StyledCard>
          <StyledCard>
            <Link href="/create-tournament">
              <CardMedia
                overlay={
                  <CardTitle
                    title="Create Tournament"
                    subtitle="Connect matches to one tournament"
                  />
                }
              >
                <img src="static/img/match.jpg" alt="Beacvolleyballcourt" />
              </CardMedia>
            </Link>
          </StyledCard>
          <StyledCard>
            <Link href="/tournaments">
              <CardMedia
                overlay={
                  <CardTitle
                    title="Live score"
                    subtitle="Get livescore from an tournament or one match"
                  />
                }
              >
                <img src="static/img/match.jpg" alt="Beacvolleyballcourt" />
              </CardMedia>
            </Link>
          </StyledCard>
        </main>
      </div>
    </MuiThemeProvider>
  );
};
