import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatchesRequest, updateMatch } from "./../store/tournamentAdmin/action"; // update the path
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentAdmin/matchView";
import { Box, Button, Grid } from "@mui/material";
import { match } from "assert";
import { useParams } from "react-router-dom";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch } from "../components/tournamentAdmin/types";



const TournamentAdmin = () => {
  const params = useParams();
  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : ""
  const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);

  useEffect(() => {
    // Define your async function
    const fetchData = async (tournamentSlug: string) => {
      try {
        const response = await fetch(`https://tournament-sync.herokuapp.com/sync/v1/tournament/${tournamentSlug}`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call it once on mount
    if (tournamentSlug) {
      fetchData(tournamentSlug);
    }

    // Then call it every 30 seconds
    const intervalId = setInterval(fetchData, 30000, tournamentSlug);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [tournamentSlug]);

  const dispatch = useDispatch();
  let db = getFirestore()

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches.matches);
  const ongoingMatches = Object.values(matches).filter(match => !match.hasWinner);
  const finishedMatches = Object.values(matches).filter(match => match.hasWinner);

  // Fetch the matches when the component mounts
  if (!fetchedMatches && tournamentSlug) {
    dispatch(fetchMatchesRequest(tournamentSlug)); // replace with actual tournamentSlug
    setFetchedMatches(true)
  }

  if (!createdCallbacks && tournamentSlug) {
    const matchCollection = collection(db, "Tournaments", tournamentSlug, "Matches");
    onSnapshot(matchCollection, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        if (data) {
          let updatedMatch = parseAdminMatch(data)
          console.log("Prepare data: ", updatedMatch);
          dispatch(updateMatch({ match: updatedMatch, matchId: updatedMatch.matchId }))
          console.log("Dispatched");
        }
      });
    });
    setCreatedCallbacks(true)
  }

  const renderMatches = (matches: AdminMatch[], tournamentSlug: string) => {
    return (
      <Grid container spacing={0} columns={12}>
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
        {showOngoing && renderMatches(ongoingMatches, tournamentSlug)}

        <h2>
          Finished Matches{" "}
          <Button variant="contained" onClick={() => setShowFinished(!showFinished)}>
            {showFinished ? "Hide" : "Show"}
          </Button>
        </h2>
        {showFinished && renderMatches(finishedMatches, tournamentSlug)}
      </Box>
    </Box>
  );
};

export default TournamentAdmin;
