import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useState } from "react";

import { createTournamentAction } from "./../store/tournament/reducer";

function CreateTournement() {
  const styleDivbox = {
    color: "black",
    margin: "1vw",
    border: "1px solid black",
  };

  const styleTournamentCreatedBox = {
    color: "black",
    margin: "1vw",
    border: "1px solid black",
    display: "none",
  };
  //local state hooks in react
  const [tournamentNameState, setTournamentNameState] = useState("");
  const [tournamentIDState, setTournamentIDState] = useState(0);

  //redux-toolkit
  const createTournamentState = useAppSelector(
    (state) => state.tournament.initState
  );
  const dispatch = useAppDispatch();

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
  }

  return (
    <div>
      <div style={styleDivbox}>
        <div style={{ margin: "1vw" }}>CREATE TOURNEMENT HERE</div>
        <div style={{ margin: "2vw" }}>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="textfield-tournementName"
              label="Tournament name"
              variant="standard"
              onChange={(e) => setTournamentNameState(e.target.value)}
            />
          </Box>
        </div>
        <div style={{ margin: "1vw" }}>
          <Button variant="contained" onClick={createTournamentClick}>
            Create tournement
          </Button>
          <div style={styleTournamentCreatedBox}>
            <p>Turneringens navn: {createTournamentState.tournamentName}</p>
            <p>Turneringens ID: {createTournamentState.tournamentID}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTournement;
