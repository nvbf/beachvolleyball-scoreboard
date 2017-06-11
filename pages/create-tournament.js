import React from "react";

import { saveTournament } from "../src/firebase";
import src from "debug";
//todo: create tournaments

class CreateTournamentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      publicId: 0,
      privateId: 0
    };
  }

  createTournament = () => {
    const name = document.getElementById("name").value;
    const result = saveTournament(name);
    console.log("result, ", result);
    this.setState({
      publicId: result.publicId,
      privateId: result.privateId
    });
  };

  render() {
    return (
      <main>
        <h1>Tournaments</h1>
        Tournamentname:<input id="name" />
        <button disabled={this.state.created} onClick={this.createTournament}>
          Create Tournament
        </button>
        {tournamentInfo(this.state.publicId, this.state.privateId)}
      </main>
    );
  }
}

function tournamentInfo(publicId, privateId) {
  if (!(publicId && privateId)) {
    return;
  }
  return (
    <section id="createdTournamentInfo">
      <h4>Tournament ID's</h4>
      <h4>publicId</h4>
      <p> {publicId} </p>
      <h4>privateId</h4>
      <p>{privateId}</p>
      <p>
        To see all matches in your tournament go to
        {" "}<a href={`tournament/${publicId}`}>/tournaments/{publicId}</a>
      </p>
      <p>
        To create a match that appears on the tournament page.
        add the private tournamnent id in settings -> tournament id for the
        {" "}<a href="/match">scoresheet page</a>
        {" "}
      </p>
    </section>
  );
}

export default CreateTournamentsPage;
