import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatchesRequest } from "./../store/tournamentAdmin/action"; // update the path
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentAdmin/matchView";
import { Box, Button, Grid } from "@mui/material";
import { match } from "assert";
import { useParams } from "react-router-dom";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";



const TournamentAdmin = () => {
  const params = useParams();
  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : "dummy"
  const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);

  const dispatch = useDispatch();
  let db = getFirestore()
  useEffect(() => {

    onSnapshot(doc(db, "Tournaments", "osvb_test_2023", "Matches", "1"), (doc) => {
      console.log("Current data: ", doc.data());
    });
  }, [onSnapshot]);

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches.matches);
  const ongoingMatches = Object.values(matches).filter(match => !match.hasWinner);
  const finishedMatches = Object.values(matches).filter(match => match.hasWinner);

  // Fetch the matches when the component mounts
  useEffect(() => {
    dispatch(fetchMatchesRequest(tournamentSlug)); // replace with actual tournamentSlug
  }, [dispatch]);


  const renderMatches = (matches: any[], hasWinner: boolean, tournamentSlug: string) => {
    console.log("This is renderMatches" + ongoingMatches)
    console.log("This is renderMatches" + finishedMatches)
    return (
      <Grid container spacing={3} columns={12}>
        {matches.map((match, index) => (

          <Grid item key={index} xs={12}>
            <MatchView match={match} tournamentSlug={tournamentSlug} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box p={3}>
      <Box mt={3}>
        <h2>
          Ongoing Matches{" "}
          <Button variant="contained" onClick={() => setShowOngoing(!showOngoing)}>
            {showOngoing ? "Hide" : "Show"}
          </Button>
        </h2>
        {showOngoing && renderMatches(ongoingMatches, true, tournamentSlug)}

        <h2>
          Finished Matches{" "}
          <Button variant="contained" onClick={() => setShowFinished(!showFinished)}>
            {showFinished ? "Hide" : "Show"}
          </Button>
        </h2>
        {showFinished && renderMatches(finishedMatches, false, tournamentSlug)}
      </Box>
    </Box>
  );
};

export default TournamentAdmin;
