import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatchesRequest, updateMatch } from "./../store/tournamentAdmin/action"; // update the path
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentAdmin/matchView";
import { Box, Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getMatchState, getStatusColor, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";

const TournamentAdmin = () => {
  const params = useParams();
  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : ""
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);

  const [seeUpcoming, setSeeUpcoming] = useState(true);
  const [seeOngoing, setSeeOngoing] = useState(true);
  const [seeFinished, setSeeFinished] = useState(true);
  const [seeReported, setSeeReported] = useState(false);
  const [descending, setDescending] = useState(true);

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
    const intervalId = setInterval(fetchData, 360000, tournamentSlug);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [tournamentSlug]);

  const dispatch = useDispatch();
  let db = getFirestore()

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches.matches);
  const matchesList = Object.values(matches);

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
          dispatch(updateMatch({ match: updatedMatch, matchId: updatedMatch.matchId }))
        }
      });
    });
    setCreatedCallbacks(true)
  }

  const renderMatches = (matches: AdminMatch[], tournamentSlug: string, descending: boolean) => {
    return (
      <Grid container
        spacing={0}
        rowSpacing={0}
        columns={12}
        justifyContent="space-evenly"
        alignItems="center">

        {matches.sort((a, b) => (descending ? (a.startTime - b.startTime) : (b.startTime - a.startTime))).filter(e => {
          return seeUpcoming && isUpcoming(e) ||
            seeOngoing && isOngoing(e) ||
            seeFinished && isFinished(e) ||
            seeReported && isReported(e)
        }).map((match, index) => (
          <Grid item key={index} xs={12}>
            <MatchView match={match} tournamentSlug={tournamentSlug} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const isUpcoming = (match: AdminMatch) => {
    return getMatchState(match) === MatchState.Upcoming
  }

  const isOngoing = (match: AdminMatch) => {
    return getMatchState(match) === MatchState.Ongoing
  }

  const isFinished = (match: AdminMatch) => {
    return getMatchState(match) === MatchState.Finished
  }

  const isReported = (match: AdminMatch) => {
    return getMatchState(match) === MatchState.Reported
  }

  return (
    <Grid container
      spacing={4}
      columns={12}
      justifyContent="space-evenly"
      alignItems="center"
      marginTop={1}
    >
      <Grid item >
        <Button variant={seeUpcoming ? "contained" : "outlined"}
          sx={{
            backgroundColor: seeUpcoming ? getStatusColor(MatchState.Upcoming) : "",
            borderColor: !seeUpcoming ? getStatusColor(MatchState.Upcoming) : "",
            color: "#333333",
            '&:hover': {
              backgroundColor: seeUpcoming ? getStatusColor(MatchState.Upcoming) : "",
              borderColor: !seeUpcoming ? getStatusColor(MatchState.Upcoming) : "",
            }
          }}
          onClick={() => setSeeUpcoming(!seeUpcoming)}>
          upcoming
        </Button>
      </Grid>
      <Grid item >
        <Button variant={seeOngoing ? "contained" : "outlined"}
          sx={{
            backgroundColor: seeOngoing ? getStatusColor(MatchState.Ongoing) : "",
            borderColor: !seeOngoing ? getStatusColor(MatchState.Ongoing) : "",
            color: "#333333",
            '&:hover': {
              backgroundColor: seeOngoing ? getStatusColor(MatchState.Ongoing) : "",
              borderColor: !seeOngoing ? getStatusColor(MatchState.Ongoing) : "",
            }
          }}
          onClick={() => setSeeOngoing(!seeOngoing)}>
          ongoing
        </Button>
      </Grid>
      <Grid item>
        <Button variant={seeFinished ? "contained" : "outlined"}
          sx={{
            backgroundColor: seeFinished ? getStatusColor(MatchState.Finished) : "",
            borderColor: !seeFinished ? getStatusColor(MatchState.Finished) : "",
            color: "#333333",
            borderWidth: 3,
            '&:hover': {
              backgroundColor: seeFinished ? getStatusColor(MatchState.Finished) : "",
              borderColor: !seeFinished ? getStatusColor(MatchState.Finished) : "",
              borderWidth: 3,
            }
          }}
          onClick={() => setSeeFinished(!seeFinished)}>
          finished
        </Button>
      </Grid>
      <Grid item >
        <Button variant={seeReported ? "contained" : "outlined"}
          sx={{
            backgroundColor: seeReported ? getStatusColor(MatchState.Reported) : "",
            borderColor: !seeReported ? getStatusColor(MatchState.Reported) : "",
            color: "#333333",
            '&:hover': {
              backgroundColor: seeReported ? getStatusColor(MatchState.Reported) : "",
              borderColor: !seeReported ? getStatusColor(MatchState.Reported) : "",
            }
          }}
          onClick={() => setSeeReported(!seeReported)}>
          reported
        </Button>
      </Grid>
      <Grid item >
        <Button variant={descending ? "contained" : "outlined"}
          sx={{
            backgroundColor: descending ? "#999999" : "",
            borderColor: !descending ? "#999999" : "",
            color: "#333333",
            '&:hover': {
              backgroundColor: descending ? "#999999" : "",
              borderColor: !descending ? "#999999" : "",
            }
          }}
          onClick={() => setDescending(!descending)}>
          descending
        </Button>
      </Grid>
      <Grid item xs={12}>
        {renderMatches(matchesList, tournamentSlug, descending)}
      </Grid>
    </Grid>
  );
};

export default TournamentAdmin;
