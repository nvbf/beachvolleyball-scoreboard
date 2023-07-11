import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { chooseCourt, chooseDay, fetchMatchesRequest, updateMatch } from "./../store/tournamentAdmin/action"; // update the path
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentAdmin/matchView";
import { Box, Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { Sort } from '@mui/icons-material';
import { collection, doc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getMatchState, getStatusColor, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { dateStringToString } from "../util/time";

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
  const [selectDay, setSelectDay] = useState(false);
  const [selectCourt, setSelectCourt] = useState(false);

  function handleSelectDay(day: string) {
    dispatch(chooseDay(day));
    setSelectDay(false);
  }

  function handleSelectCourt(court: string) {
    dispatch(chooseCourt(court));
    setSelectCourt(false);
  }

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
  const matches = useSelector((state: RootState) => state.matches);
  const matchesList = Object.values(matches.matches);

  // Fetch the matches when the component mounts
  if (!fetchedMatches && tournamentSlug) {
    setFetchedMatches(true)
    dispatch(fetchMatchesRequest(tournamentSlug)); // replace with actual tournamentSlug
  }

  if (!createdCallbacks && tournamentSlug) {
    const currentDate: string = new Date().toISOString().split('T')[0];
    const q = query(collection(db, "Tournaments", tournamentSlug, "Matches"), where("Date", "==", currentDate), where("HasWinner", "==", false));

    setCreatedCallbacks(true)
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((doc) => {
        let data = doc.doc.data()
        if (data) {
          let updatedMatch = parseAdminMatch(data)
          console.log("got update for match %s", updatedMatch.matchId)
          dispatch(updateMatch({ match: updatedMatch, matchId: updatedMatch.matchId }))
        }
      });
    });
  }

  const renderMatches = (matches: AdminMatch[], tournamentSlug: string, descending: boolean, selectedDay: string, selectedCourt: string) => {
    return (
      <Grid container
        spacing={0}
        rowSpacing={0}
        columns={12}
        justifyContent="space-evenly"
        alignItems="center">

        {matches.sort(
          (a, b) => (descending ? (a.startTime - b.startTime) : (b.startTime - a.startTime))
        ).filter(e => {
          return seeUpcoming && isUpcoming(e) ||
            seeOngoing && isOngoing(e) ||
            seeFinished && isFinished(e) ||
            seeReported && isReported(e)
        }).filter(e => {
          return selectedDay === "all" ? true : (new Date(e.startTime).toISOString().split('T')[0] === selectedDay)
        }).filter(e => {
          return selectedCourt === "all" ? true : e.arenaName === selectedCourt
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

  return (<Grid container
    rowSpacing={1}
    columnSpacing={0}
    columns={12}
    justifyContent="space-evenly"
    alignItems="center"
    marginTop={1}
  >
    <Grid item xs={12}>
      <Grid container
        rowSpacing={1}
        columnSpacing={0}
        columns={12}
        justifyContent="space-evenly"
        alignItems="center"
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
            <Sort />
          </Button>
        </Grid>
      </Grid>
    </Grid>
    {!(selectDay || selectCourt) && <Grid item xs={12}>
      <Grid container
        rowSpacing={1}
        columnSpacing={2}
        columns={12}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button variant={seeUpcoming ? "contained" : "outlined"}
            sx={{
              backgroundColor: "#cccccc",
              color: "#333333",
              '&:hover': {
                backgroundColor: "#cccccc",
              }
            }}
            onClick={() => setSelectDay(true)}>
            {matches.selectedDay === "all" ? "choose day" : dateStringToString(matches.selectedDay)}
          </Button>
        </Grid>
        <Grid item>
          <Button variant={seeUpcoming ? "contained" : "outlined"}
            sx={{
              backgroundColor: "#cccccc",
              color: "#333333",
              '&:hover': {
                backgroundColor: "#cccccc",
              }
            }}
            onClick={() => setSelectCourt(true)}>
            {matches.selectedCourt === "all" ? "choose court" : matches.selectedCourt}
          </Button>
        </Grid>
      </Grid>
    </Grid>}
    {selectDay && <Grid item xs={12}>
      <Grid container
        rowSpacing={1}
        columnSpacing={1}
        columns={12}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button variant={"all" === matches.selectedDay ? "contained" : "outlined"}
            sx={{
              backgroundColor: "all" === matches.selectedDay ? "#999999" : "",
              borderColor: !("all" === matches.selectedDay) ? "#999999" : "",
              color: "#333333",
              '&:hover': {
                backgroundColor: "all" === matches.selectedDay ? "#999999" : "",
                borderColor: !("all" === matches.selectedDay) ? "#999999" : "",
              }
            }}
            onClick={() => handleSelectDay("all")}>
            all days
          </Button>
        </Grid>
        {matches.dates.map((date) => (
          <Grid item key={date}>
            <Button variant={date === matches.selectedDay ? "contained" : "outlined"}
              sx={{
                backgroundColor: date === matches.selectedDay ? "#999999" : "",
                borderColor: !(date === matches.selectedDay) ? "#999999" : "",
                color: "#333333",
                '&:hover': {
                  backgroundColor: date === matches.selectedDay ? "#999999" : "",
                  borderColor: !(date === matches.selectedDay) ? "#999999" : "",
                }
              }}
              onClick={() => handleSelectDay(date)}>
              {dateStringToString(date)}
            </Button>
          </Grid>
        ))
        }
      </Grid>
    </Grid>}
    {selectCourt && <Grid item xs={12}>
      <Grid container
        rowSpacing={1}
        columnSpacing={1}
        columns={12}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button variant={"all" === matches.selectedCourt ? "contained" : "outlined"}
            sx={{
              backgroundColor: "all" === matches.selectedCourt ? "#999999" : "",
              borderColor: !("all" === matches.selectedCourt) ? "#999999" : "",
              color: "#333333",
              '&:hover': {
                backgroundColor: "all" === matches.selectedCourt ? "#999999" : "",
                borderColor: !("all" === matches.selectedCourt) ? "#999999" : "",
              }
            }}
            onClick={() => handleSelectCourt("all")}>
            all courts
          </Button>
        </Grid>
        {matches.fields.map((court) => (
          <Grid item key={court}>
            <Button variant={court === matches.selectedCourt ? "contained" : "outlined"}
              sx={{
                backgroundColor: court === matches.selectedCourt ? "#999999" : "",
                borderColor: !(court === matches.selectedCourt) ? "#999999" : "",
                color: "#333333",
                '&:hover': {
                  backgroundColor: court === matches.selectedCourt ? "#999999" : "",
                  borderColor: !(court === matches.selectedCourt) ? "#999999" : "",
                }
              }}
              onClick={() => handleSelectCourt(court)}>
              {court}
            </Button>
          </Grid>
        ))
        }
      </Grid>
    </Grid>}
    <Grid item xs={12}>
      {renderMatches(matchesList, tournamentSlug, descending, matches.selectedDay, matches.selectedCourt)}
    </Grid>
  </Grid>
  );
};

export default TournamentAdmin;
