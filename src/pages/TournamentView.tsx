import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentView/matchView";
import { Box, Button, Grid } from "@mui/material";
import { Sort } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import { QueryFieldFilterConstraint, collection, doc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getMatchState, getStatusColor, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { dateStringToString } from "../util/time";
import { chooseCourt, chooseDay, fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";

const TournamentView = () => {
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);
  let tournamentSlug: string;
  switch (params.tournamentSlug) {
    case "jr-nm-1":
      tournamentSlug = "nmu15_-_nmu17_-_nmu19"
      break;
    case 'jr-nm-2':
      tournamentSlug = "nmu16_-_nmu18_-_nmu21"
      break;
    default:
      tournamentSlug = params.tournamentSlug || "lofoten_open_23"
      break;
  }
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);

  const [seeUpcoming, setSeeUpcoming] = useState(true);
  const [seeOngoing, setSeeOngoing] = useState(true);
  const [seeFinished, setSeeFinished] = useState(true);
  const [selectDay, setSelectDay] = useState(false);
  const [selectCourt, setSelectCourt] = useState(false);

  const playerClass = searchParams.get('class');
  const noDate = searchParams.get('noDate');

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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sync/v1/tournament/${tournamentSlug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Set Content-Type header to application/json
          },
        }); const data = await response.json();
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
  const matchesList: AdminMatch[] = Object.values(matches.matches);

  // Fetch the matches when the component mounts
  useEffect(() => {
    if (!fetchedMatches && tournamentSlug) {
      setFetchedMatches(true)
      dispatch(fetchMatchesRequest({ tournamentSlug: tournamentSlug, class: playerClass }));
    }
  })

  if (!createdCallbacks && tournamentSlug) {
    const currentDate: string = new Date().toISOString().split('T')[0];
    let collectionQuery: QueryFieldFilterConstraint[] = []
    if (noDate === null) {
      collectionQuery.push(where("Date", "==", currentDate))
    }
    collectionQuery.push(where("HasWinner", "==", false))
    if (playerClass != null) {
      collectionQuery.push(where("MatchCategory.CategoryCode", "==", playerClass))
    }
    const q = query(collection(db, "Tournaments", tournamentSlug, "Matches"), ...collectionQuery);

    setCreatedCallbacks(true)
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        let data = change.doc.data()
        if (data) {
          let updatedMatch = parseAdminMatch(data)
          console.log("got update for match %s", updatedMatch.matchId)
          dispatch(updateMatch({ match: updatedMatch, matchId: updatedMatch.matchId }))
        }
      });
    });
  }

  const renderMatches = (matches: AdminMatch[], tournamentSlug: string, selectedDay: string, selectedCourt: string) => {
    return (
      <Grid container
        spacing={0}
        rowSpacing={0}
        columns={12}
        justifyContent="space-evenly"
        alignItems="center">

        {matches.sort((a, b) => (a.startTime - b.startTime)).filter(e => {
          return seeUpcoming && isUpcoming(e) ||
            seeOngoing && isOngoing(e) ||
            seeFinished && (isFinished(e) || isReported(e))
        }).filter(e => {
          return selectedDay === "all" ? true : (new Date(e.startTime).toISOString().split('T')[0] === selectedDay)
        }).filter(e => {
          return selectedCourt === "all" ? true : e.arenaName === selectedCourt
        }).map((match, index) => (
          <Grid item key={index} xs={12} margin={0}>
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
        {renderMatches(matchesList, tournamentSlug, matches.selectedDay, matches.selectedCourt)}
      </Grid>
    </Grid>
  );
};

export default TournamentView;
