import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useState } from "react";
import { db } from "../firebase/firebase-config";
import {
  getTournamentNamesFromFirestore,
  postTournamentNamesToFirestore,
} from "../firebase/interaction-firebase";
import { createTournamentAction } from "./../store/tournament/reducer";

function CreateTournement() {
  //local state hooks in react
  const [tournamentNameState, setTournamentNameState] = useState("");
  const [tournamentIDState, setTournamentIDState] = useState(0);

  //redux-toolkit
  const createTournamentState = useAppSelector(
    (state) => state.tournament.initState
  );
  const dispatch = useAppDispatch();

  //make div box hide when button clicked
  const [visible, setVisible] = useState(false);

  function createTournamentClick() {
    //creates random number
    const min = 1;
    const max = 100;
    const rand = Math.floor(min + Math.random() * (max - min));
    setTournamentIDState(rand);
    dispatch(
      createTournamentAction.addTournamentName({
        tournamentName: tournamentNameState,
        tournamentID: tournamentIDState,
      })
    );
    setVisible(true);
  }

  let style = { display: "none" };
  if (visible) {
    style.display = "block";
  }

  return (
    <div>
      <div className="createTournamentDiv createTournamentSchema">
        <h3 style={{ margin: "20px", marginTop: "30px" }}>
          CREATE NEW TOURNEMENT HERE
        </h3>
        <Box style={{ margin: "20px" }}>
          <TextField
            id="textfield-tournementName"
            label="Tournament name"
            variant="standard"
          />
        </Box>
        <Button
          style={{ margin: "20px", backgroundColor: "rgba(0, 0, 50, 0.87)" }}
          variant="contained"
          onClick={createTournamentClick}
        >
          Create tournement
        </Button>
      </div>

      <div style={style} className="createTournamentDiv createTournamentList">
        <h3 style={{ margin: "20px" }}>Tournament ID</h3>
        <p style={{ margin: "20px" }}>
          Turneringens navn: {createTournamentState.tournamentName}
          Turneringens navn(firebaseTest): {}
        </p>
        <p style={{ margin: "20px" }}>
          Turneringens ID: {createTournamentState.tournamentID}
        </p>
        <hr
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.12)",
            margin: "0px",
            height: "1.5px",
            border: "none",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        />
        <h4 style={{ margin: "20px" }}>to see all tournaments go to ....</h4>
        <h4 style={{ margin: "20px" }}>
          To create a match that appears on the tournament page. Add the private
          tournamnent id in settings then tournament id for the scoresheet page
        </h4>
      </div>
    </div>
  );
}

export default CreateTournement;
