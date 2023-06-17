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

  const [seeUpcomming, setSeeUpcomming] = useState(true);
  const [seeOngoing, setSeeOngoing] = useState(true);
  const [seeFinished, setSeeFinished] = useState(true);
  const [seeReported, setSeeReported] = useState(false);

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

  const renderMatches = (matches: AdminMatch[], tournamentSlug: string) => {
    return (
      <Grid container
        spacing={0}
        rowSpacing={0}
        columns={12}
        justifyContent="space-evenly"
        alignItems="center">

        {matches.sort((a, b) => a.startTime - b.startTime).filter(e => {
          return seeUpcomming && isUpcomming(e) ||
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

  const isUpcomming = (match: AdminMatch) => {
    return getMatchState(match) === MatchState.Upcomming
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
        <Button variant={seeUpcomming ? "contained" : "outlined"}
          sx={{
            backgroundColor: seeUpcomming ? getStatusColor(MatchState.Upcomming) : "",
            borderColor: !seeUpcomming ? getStatusColor(MatchState.Upcomming) : "",
            color: "#333333",
            '&:hover': {
              backgroundColor: seeUpcomming ? getStatusColor(MatchState.Upcomming) : "",
              borderColor: !seeUpcomming ? getStatusColor(MatchState.Upcomming) : "",
            }
          }}
          onClick={() => setSeeUpcomming(!seeUpcomming)}>
          upcomming
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
      <Grid item xs={12}>
        {renderMatches(matchesList, tournamentSlug)}
      </Grid>
    </Grid>
  );
};

export default TournamentAdmin;
