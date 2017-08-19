import React from "react";

import { saveTournament } from "../../src/firebase";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "../../src/components/components/appbar";
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
  CardTitle
} from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";

import src from "debug";
import { startAnonymousAuth } from "../../src/util/auth";

class CreateTournamentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      publicId: 0,
      privateId: 0,
      failed: false
    };
  }

  createTournament = () => {
    const name = document.getElementById("name").value;
    const result = saveTournament(name);
    if (result) {
      this.setState({
        created: true,
        publicId: result.publicId,
        privateId: result.privateId
      });
    } else {
      this.setState({
        failed: true
      });
    }
  };

  componentDidMount() {
    startAnonymousAuth();
  }

  render() {
    return (
      <MuiThemeProvider>
        <Card>
          <CardTitle title="Create a new tournament" />
          <CardText>
            <TextField
              id="name"
              hintText="Tournament name"
              disabled={this.state.created}
            />
          </CardText>
          <CardActions>
            <RaisedButton
              primary
              label="Create Tournament"
              disabled={this.state.created}
              onClick={this.createTournament}
            />
          </CardActions>
          {tournamentInfo(
            this.state.publicId,
            this.state.privateId,
            this.state.failed
          )}
        </Card>
      </MuiThemeProvider>
    );
  }
}

function tournamentInfo(publicId, privateId, failed) {
  if (failed) {
    <h2>Failed to create tournaments, try with another name.</h2>;
  }

  if (!(publicId && privateId)) {
    return;
  }
  return (
    <Card id="createdTournamentInfo">
      <CardTitle>Tournament ID's</CardTitle>
      <CardText>
        <List>
          <ListItem primaryText={publicId} secondaryText="publicId" />
          <ListItem primaryText={privateId} secondaryText="privateId" />
        </List>
        <Divider inset={true} />
        <h4>
          To see all matches in your tournament go to{" "}
          <a href={`/tournament/${publicId}`}>/tournaments/{publicId}</a>
        </h4>
        <h4>
          To create a match that appears on the tournament page. Add the private
          tournamnent id in settings -> tournament id for the{" "}
          <a href="/match">scoresheet page</a>
        </h4>
        <CardActions>
          <RaisedButton label="Go to this Tournament" />
          <RaisedButton label="Create Match" />
          <RaisedButton label="See Tournaments" />
        </CardActions>
      </CardText>
    </Card>
  );
}

export default CreateTournamentsPage;
