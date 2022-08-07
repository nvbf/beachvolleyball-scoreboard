import React from "react";

import { saveTournament } from "../src/firebase";
import AppBar from "../src/components/components/appbar";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  List,
  ListItem,
  Button,
  Divider,
  Container,
  ListItemText
} from "@material-ui/core";

import src from "debug";
import { startAnonymousAuth } from "../src/util/auth";

class CreateTournamentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      slug: 0,
      privateId: 0,
      failed: false
    };
    this.setStateAsync = this.setStateAsync.bind(this);
    this.createTournament = this.createTournament.bind(this);
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async createTournament() {
    const name = document.getElementById("name").value;
    const result = await saveTournament(name);
    console.log("result of saveTournament", result);
    if (result) {
      this.setStateAsync({
        created: true,
        slug: result.slug,
        privateId: result.privateId
      });
    } else {
      this.setStateAsync({
        failed: true
      });
    }
  }

  render() {
    return (
      <Container maxWidth='xs'>
        <Card>
          <CardHeader title='Create a new tournament' />
          <CardContent>
            <TextField
              id="name"
              label="Tournament name"
              disabled={this.state.created}
              fullWidth
            />
          </CardContent>
          <CardActions >
            <Button
              color='primary'
              variant='contained'
              disabled={this.state.created}
              onClick={this.createTournament}
            >Create Tournament</Button>
          </CardActions>
          {tournamentInfo(
            this.state.slug,
            this.state.privateId,
            this.state.failed
          )}
        </Card>
      </Container>
    );
  }
}

function tournamentInfo(slug, privateId, failed) {
  console.log("failed", failed);
  if (failed) {
    <h2>Failed to create tournaments, try with another name.</h2>;
  }

  if (!(slug && privateId)) {
    return;
  }
  return (
    <Card id="createdTournamentInfo">
      <CardHeader title={"Tournament ID's"} />
      <CardContent>
        <List>
          <ListItem>
            <ListItemText primary={slug} secondary="slug" />
          </ListItem>
          <ListItem>
            <ListItemText primary={privateId} secondary="privateId" />
          </ListItem>
        </List>
        <Divider inset={true} />
        <h4>
          To see all matches in your tournament go to{" "}
          <a href={`/tournament/${slug}`}>/tournaments/{slug}</a>
        </h4>
        <h4>
          To create a match that appears on the tournament page. Add the private
          tournamnent id in settings -> tournament id for the{" "}
          <a href="/match">scoresheet page</a>
        </h4>
        <CardActions>
          <Button label="Go to this Tournament" />
          <Button label="Create Match" />
          <Button label="See Tournaments" />
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default CreateTournamentsPage;
