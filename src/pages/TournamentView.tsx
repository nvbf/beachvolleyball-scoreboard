import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../store/store"; // update the path to your store file
import MatchCard from "../components/tournamentView/MatchCard";
import { Box, Button, Grid, Container, Typography, AppBar, Toolbar } from "@mui/material";
import { Sort, ArrowBack, CalendarMonth, Place } from '@mui/icons-material';
import { useParams, useNavigate } from "react-router-dom";
import "./TournamentView.css";
import { QueryFieldFilterConstraint, collection, doc, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getMatchState, getStatusColor, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { dateStringToString } from "../util/time";
import { chooseCourt, chooseDay, fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";

const TournamentView = () => {
  const params = useParams();
  const navigate = useNavigate();
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
  const [tournamentName, setTournamentName] = useState<string>("");

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
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)

  useEffect(() => {
    if (!tournamentSlug) return;
    const fetchName = async () => {
      const snap = await getDocs(collection(db, "Tournaments"));
      const match = snap.docs.find(d => d.data().Slug === tournamentSlug);
      if (match) setTournamentName(match.data().Name);
    };
    fetchName();
  }, [tournamentSlug]);

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
    const filteredMatches = matches
      .sort((a, b) => (a.startTime - b.startTime))
      .filter(e => {
        return seeUpcoming && isUpcoming(e) ||
          seeOngoing && isOngoing(e) ||
          seeFinished && (isFinished(e) || isReported(e))
      })
      .filter(e => {
        return selectedDay === "all" ? true : (new Date(e.startTime).toISOString().split('T')[0] === selectedDay)
      })
      .filter(e => {
        return selectedCourt === "all" ? true : e.arenaName === selectedCourt
      });

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, margin: "0 auto" }}>
        {filteredMatches.map((match, index) => (
          <MatchCard key={`${match.matchId}-${index}`} match={match} tournamentSlug={tournamentSlug} />
        ))}
      </Box>
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F3EFE6" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#F3EFE6",
          color: "#2D3748",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid #E2E8F0",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "70px" }}>
          <Box sx={{ flex: 1 }}>
            <Button
              onClick={() => navigate("/tournaments")}
              sx={{
                padding: "8px",
                borderRadius: "50%",
                color: "#2D3748",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
              }}
            >
              <ArrowBack />
            </Button>
          </Box>
          <Typography
            variant="h5"
            sx={{
              flex: 1,
              textAlign: "center",
              fontWeight: 800,
              letterSpacing: "0.05em",
              fontSize: { xs: "20px", md: "28px" },
              color: "#2D3748",
            }}
          >
            {tournamentName ||
              tournamentSlug
                .replace(/_/g, " ")
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
          </Typography>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Box
              component="img"
              src="/src/osvb_logo_hi_res.png"
              alt="OSVB"
              sx={{ height: { xs: "36px", sm: "44px" }, width: "auto", objectFit: "contain" }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Controls Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            mb: 6,
          }}
        >
          {/* Segmented Control */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              maxWidth: "720px",
              padding: "4px",
              borderRadius: "12px",
              gap: 1,
            }}
          >
            <Button
              onClick={() => setSeeUpcoming(!seeUpcoming)}
              sx={{
                flex: 1,
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 600,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                border: `3px solid ${seeUpcoming ? getStatusColor(MatchState.Upcoming) : "transparent"}`,
                backgroundColor: seeUpcoming ? "rgba(255, 255, 255, 0.55)" : "transparent",
                color: seeUpcoming ? "#333" : "#718096",
                boxShadow: seeUpcoming ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                "&:hover": {
                  backgroundColor: seeUpcoming ? getStatusColor(MatchState.Upcoming) : "rgba(0, 0, 0, 0.03)",
                  color: "#2D3748",
                },
              }}
            >
              Upcoming
            </Button>
            <Button
              onClick={() => setSeeOngoing(!seeOngoing)}
              sx={{
                flex: 1,
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 500,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                border: `3px solid ${seeOngoing ? getStatusColor(MatchState.Ongoing) : "transparent"}`,
                backgroundColor: seeOngoing ? "rgba(255, 255, 255, 0.55)" : "transparent",
                color: seeOngoing ? "#333" : "#718096",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: seeOngoing ? getStatusColor(MatchState.Ongoing) : "rgba(0, 0, 0, 0.03)",
                  color: "#2D3748",
                },
              }}
            >
              Ongoing
            </Button>
            <Button
              onClick={() => setSeeFinished(!seeFinished)}
              sx={{
                flex: 1,
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 500,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                border: `3px solid ${seeFinished ? getStatusColor(MatchState.Finished) : "transparent"}`,
                backgroundColor: seeFinished ? "rgba(255, 255, 255, 0.55)" : "transparent",
                color: seeFinished ? "#333" : "#718096",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: seeFinished ? getStatusColor(MatchState.Finished) : "rgba(0, 0, 0, 0.03)",
                  color: "#2D3748",
                },
              }}
            >
              Finished
            </Button>
          </Box>

          {/* Filters - Only show when not in selection mode */}
          {!(selectDay || selectCourt) && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setSelectDay(true)}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2D3748",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#F7FAFC",
                  },
                }}
              >
                <CalendarMonth sx={{ fontSize: "18px" }} />
                {matches.selectedDay === "all" ? "Choose Day" : dateStringToString(matches.selectedDay)}
              </Button>
              <Button
                onClick={() => setSelectCourt(true)}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2D3748",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#F7FAFC",
                  },
                }}
              >
                <Place sx={{ fontSize: "18px" }} />
                {matches.selectedCourt === "all" ? "Choose Court" : matches.selectedCourt}
              </Button>
            </Box>
          )}

          {/* Day Selection */}
          {selectDay && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => handleSelectDay("all")}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "all" === matches.selectedDay ? "#999999" : "transparent",
                  border: "1px solid #999999",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2D3748",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "all" === matches.selectedDay ? "#999999" : "rgba(153, 153, 153, 0.1)",
                  },
                }}
              >
                All Days
              </Button>
              {matches.dates.map((date) => (
                <Button
                  key={date}
                  onClick={() => handleSelectDay(date)}
                  sx={{
                    px: 3,
                    py: 1,
                    backgroundColor: date === matches.selectedDay ? "#999999" : "transparent",
                    border: "1px solid #999999",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#2D3748",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: date === matches.selectedDay ? "#999999" : "rgba(153, 153, 153, 0.1)",
                    },
                  }}
                >
                  {dateStringToString(date)}
                </Button>
              ))}
              <Button
                onClick={() => setSelectDay(false)}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "#E5E7EB",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2D3748",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#D1D5DB",
                  },
                }}
              >
                Close
              </Button>
            </Box>
          )}

          {/* Court Selection */}
          {selectCourt && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => handleSelectCourt("all")}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "all" === matches.selectedCourt ? "#999999" : "transparent",
                  border: "1px solid #999999",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2D3748",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "all" === matches.selectedCourt ? "#999999" : "rgba(153, 153, 153, 0.1)",
                  },
                }}
              >
                All Courts
              </Button>
              {matches.fields.map((court) => (
                <Button
                  key={court}
                  onClick={() => handleSelectCourt(court)}
                  sx={{
                    px: 3,
                    py: 1,
                    backgroundColor: court === matches.selectedCourt ? "#999999" : "transparent",
                    border: "1px solid #999999",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#2D3748",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: court === matches.selectedCourt ? "#999999" : "rgba(153, 153, 153, 0.1)",
                    },
                  }}
                >
                  {court}
                </Button>
              ))}
              <Button
                onClick={() => setSelectCourt(false)}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "#E5E7EB",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2D3748",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#D1D5DB",
                  },
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>

        {/* Match List */}
        <Box sx={{ pb: 6 }}>
          {renderMatches(matchesList, tournamentSlug, matches.selectedDay, matches.selectedCourt)}
        </Box>
      </Container>
    </Box>
  );
};

export default TournamentView;
