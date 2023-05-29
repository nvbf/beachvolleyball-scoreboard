import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../store/store";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { createTournamentAction } from "../store/tournament/reducer";

function CreateTournament() {



  //local state hooks in react
  const [tournamentNameState, setTournamentNameState] = useState("");
  const [profixioslugID, setProfixioslugID] = useState(0);

  //redux-toolkit
  const createTournamentState = useAppSelector(
    (state) => state.tournament.initState
  );
  const dispatch = useAppDispatch();

  //make div box hide when button clicked
  const [visible, setVisible] = useState(false);

  async function createTournamentClick() {
    //creates random number
    const min = 1;
    const max = 100;
    const rand = Math.floor(min + Math.random() * (max - min));

    const newTournament = {
      tournamentName: tournamentNameState,
      profixioslugID: rand,
    };

    // Add a new document to the 'tournaments' collection
    try {
      const docRef = await addDoc(collection(db, "tournaments"), newTournament);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // Update the state and dispatch the action
    setProfixioslugID(rand);
    dispatch(
      createTournamentAction.addTournamentName(newTournament)
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
          CREATE NEW TOURNAMENT HERE
        </h3>
        <Box style={{ margin: "20px" }}>
          <TextField
            id="textfield-tournamentName"
            label="Tournament name"
            variant="standard"
            value={tournamentNameState}
            onChange={(e) => setTournamentNameState(e.target.value)}
          />
        </Box>
        <Button
          style={{ margin: "20px", backgroundColor: "rgba(0, 0, 50, 0.87)" }}
          variant="contained"
          onClick={createTournamentClick}
        >
          Create tournament
        </Button>
      </div>

      <div style={style} className="createTournamentDiv createTournamentList">
        <h3 style={{ margin: "20px" }}>Tournament ID</h3>
        <p style={{ margin: "20px" }}>
          Turneringens navn: {createTournamentState.tournamentName}
          Turneringens navn(firebaseTest): {}
        </p>
        <p style={{ margin: "20px" }}>
          Turneringens ID: {createTournamentState.profixioslugID}
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
          tournament id in settings then tournament id for the scoresheet page
        </h4>
      </div>
    </div>
  );
}

export default CreateTournament;
