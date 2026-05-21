import { Grid, Typography } from "@mui/material";
import { QueryFieldFilterConstraint, collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import { parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch } from "../components/tournamentAdmin/types";
import { TeamType } from "../components/types";
import { getInitials } from "../util/names";
import { fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";
import { timestampToStringHours } from "../util/time";

const demoCurrentMatch: AdminMatch = {
  matchId: 9001,
  awayTeam: {
    isWinner: false,
    name: "Team North",
    player1: "Ava Nord",
    player2: "Mia Berg",
  },
  currentScore: [
    {
      [TeamType.Home]: 18,
      [TeamType.Away]: 16,
    },
  ],
  currentSetScore: {
    [TeamType.Home]: 1,
    [TeamType.Away]: 0,
  },
  sets: [
    {
      [TeamType.Home]: 21,
      [TeamType.Away]: 18,
    },
  ],
  startTime: Date.now() + 3 * 60 * 1000,
  startTimestamp: Date.now() - 20 * 60 * 1000,
  arenaName: "Center Court",
  hasWinner: false,
  isFinalized: false,
  isStarted: true,
  referee: "Demo Ref",
  homeTeam: {
    isWinner: false,
    name: "Team South",
    player1: "Noah Strand",
    player2: "Elias Vik",
  },
  matchCategory: "Men",
  matchGroup: "A",
  name: "Semi Final",
  scoreboardID: "demo-scoreboard",
};

const demoUpcomingMatches: AdminMatch[] = [
  {
    ...demoCurrentMatch,
    matchId: 9002,
    isStarted: false,
    currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }],
    currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 },
    startTime: Date.now() + 10 * 60 * 1000,
    homeTeam: {
      isWinner: false,
      name: "Team West",
      player1: "Luna Sol",
      player2: "Kari Moe",
    },
    awayTeam: {
      isWinner: false,
      name: "Team East",
      player1: "Iben Rye",
      player2: "Sara Lien",
    },
    matchCategory: "Women",
    matchGroup: "B",
    name: "Quarter Final",
  },
  {
    ...demoCurrentMatch,
    matchId: 9003,
    isStarted: false,
    currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }],
    currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 },
    startTime: Date.now() + 25 * 60 * 1000,
    homeTeam: {
      isWinner: false,
      name: "Team Sand",
      player1: "Per Holm",
      player2: "Mads Ny",
    },
    awayTeam: {
      isWinner: false,
      name: "Team Wave",
      player1: "Theo Lin",
      player2: "Ola Nybo",
    },
    matchCategory: "Mixed",
    matchGroup: "C",
    name: "Round 3",
  },
  {
    ...demoCurrentMatch,
    matchId: 9006,
    isStarted: false,
    currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }],
    currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 },
    startTime: Date.now() + 70 * 60 * 1000,
    homeTeam: {
      isWinner: false,
      name: "Team Foam",
      player1: "Mila Tor",
      player2: "Runa Sve",
    },
    awayTeam: {
      isWinner: false,
      name: "Team Shore",
      player1: "Nora Vin",
      player2: "Tina Ask",
    },
    matchCategory: "Mixed",
    matchGroup: "F",
    name: "Round 6",
  },
  {
    ...demoCurrentMatch,
    matchId: 9007,
    isStarted: false,
    currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }],
    currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 },
    startTime: Date.now() + 85 * 60 * 1000,
    homeTeam: {
      isWinner: false,
      name: "Team Bay",
      player1: "Odin Rey",
      player2: "Knut Sol",
    },
    awayTeam: {
      isWinner: false,
      name: "Team Reef",
      player1: "Vera Lim",
      player2: "Ylva Vang",
    },
    matchCategory: "Men",
    matchGroup: "G",
    name: "Round 7",
  },
];

const TournamentOverlay = () => {
  const location = useLocation();
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);
  const [showDemoCurrentMatch, setShowDemoCurrentMatch] = useState(true);
  // Extract the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tournamentSlug = queryParams.get("tournamentId") || "default";
  const isDemoMode = tournamentSlug === "demo";
  const courtID = queryParams.get("courtId");
  const noDate = queryParams.get('noDate');
  const numberSize = 32
  const nameSize = 12

  const dispatch = useDispatch();
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches.matches);
  const matchesList = Object.values(matches);

  // Fetch the matches when the component mounts
  if (!isDemoMode && !fetchedMatches && tournamentSlug) {
    dispatch(fetchMatchesRequest({ tournamentSlug: tournamentSlug, class: null })); // replace with actual tournamentSlug
    setFetchedMatches(true)
  }

  useEffect(() => {
    // Save original body background color
    const originalBodyBackgroundColor = document.body.style.backgroundColor;

    // Change body background color to transparent
    document.body.style.backgroundColor = 'transparent';

    // Reset body background color after component unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBackgroundColor;
    };
  }, []);

  useEffect(() => {
    if (!isDemoMode) {
      return;
    }

    const interval = window.setInterval(() => {
      setShowDemoCurrentMatch((previous) => !previous);
    }, 10_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isDemoMode]);

  if (!isDemoMode && !createdCallbacks && tournamentSlug) {
    const currentDate: string = new Date().toISOString().split('T')[0];
    let collectionQuery: QueryFieldFilterConstraint[] = []
    if (noDate === null) {
      collectionQuery.push(where("Date", "==", currentDate))
    }
    if (courtID != null) {
      collectionQuery.push(where("Field.Name", "==", courtID))
    }
    collectionQuery.push(where("HasWinner", "==", false))

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
    setCreatedCallbacks(true)
  }

  const currentMatch = isDemoMode
    ? (showDemoCurrentMatch ? demoCurrentMatch : undefined)
    : getCurrentMatch(matchesList, courtID || "")
  const commingMatches = isDemoMode
    ? demoUpcomingMatches
    : getCommingMatches(matchesList, courtID || "")

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        backgroundColor: 'rgba(0, 0, 0, 0)',        // backgroundColor: "rgba(0,0,0,0.7)",
        textAlign: "center",
        width: '1280px', height: '720px',
      }}
    >
      {currentMatch && <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        padding={0}
        spacing={0}
        columns={12}
        sx={{
          position: "absolute",
          width: 1,
          bottom: "60px",
          left: "0",
          right: "0",
        }}
      >
        <Grid height={60} padding={0} sx={{
          backgroundColor: "#ffffff", borderColor: "#000000",
          border: 2,
        }}>
          <Grid
            container
            spacing={1}
            height={60}
            direction="column"
            justifyContent={"center"}
            padding={0.5}
            paddingRight={1}
            paddingLeft={2}
            textAlign={"right"}
          >
            <Grid
              padding={0}>
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.4}>
                {currentMatch ? `${getInitials(currentMatch.homeTeam.player1)}` : ""}
              </Typography>
            </Grid>
            <Grid
              padding={0}>
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.0}>
                {currentMatch ? `${getInitials(currentMatch.homeTeam.player2)}` : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid height={60} sx={{
          borderColor: "#000000",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}>
          <Grid
            container
            // spacing={1}
            paddingY={0.5}
            paddingX={2}
            columns={12}
            direction={"column"}
          >
            <Grid padding={0} margin={0}>
              <Typography textTransform={"uppercase"} fontSize={8} padding={0} margin={0} noWrap>
                sets
              </Typography>
            </Grid>
            <Grid padding={0} margin={0}>
              <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
                {currentMatch ? currentMatch.currentSetScore[TeamType.Home] : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid height={60} sx={{
          backgroundColor: "#ffffff",
          borderColor: "#000000",
          border: 2,
        }}>
          <Grid
            container
            height={1}
            spacing={1}
            padding={0.5}

          // padding={1}
          >
            <Grid height={1}>
              <Typography fontSize={numberSize}>
                {currentMatch ? currentMatch.currentScore[currentMatch.currentScore.length - 1][TeamType.Home] : ""}

              </Typography>
            </Grid>
            <Grid>
              <Typography fontSize={numberSize}>
                -
              </Typography>
            </Grid>
            <Grid>
              <Typography fontSize={numberSize}>
                {currentMatch ? currentMatch.currentScore[currentMatch.currentScore.length - 1][TeamType.Away] : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid height={60} sx={{
          borderColor: "#000000",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}>
          <Grid
            container
            // spacing={1}
            paddingY={0.5}
            paddingX={2}
            columns={12}
            direction={"column"}
          >
            <Grid padding={0} margin={0}>
              <Typography textTransform={"uppercase"} fontSize={8} padding={0} margin={0} noWrap>
                sets
              </Typography>
            </Grid>
            <Grid padding={0} margin={0}>
              <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
                {currentMatch ? currentMatch.currentSetScore[TeamType.Away] : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid height={60}
          sx={{
            backgroundColor: "#ffffff",
            borderColor: "#000000",
            border: 2,
          }}>
          <Grid
            container
            spacing={1}
            height={60}
            direction="column"
            justifyContent={"center"}
            padding={0.5}
            paddingRight={2}
            paddingLeft={1}
            textAlign={"left"}
          >
            <Grid
              padding={0}>
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.4}>
                {currentMatch ? `${getInitials(currentMatch.awayTeam.player1)}` : ""}
              </Typography>
            </Grid>
            <Grid
              padding={0}>
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.0}>
                {currentMatch ? `${getInitials(currentMatch.awayTeam.player2)}` : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>}
      {!currentMatch && <Grid
        container
        direction="column"
        padding={0}
        rowGap={2}
        spacing={0}
        columns={12}
        sx={{
          position: "absolute",
          width: "567px",
          bottom: "0",
          left: "25%",
          top: "100px",
          right: "0",
        }}
      >
        <Grid height={104} width={1} padding={0} sx={{
          backgroundColor: "#00A3DA", borderColor: "#000000",
          borderRadius: "15px", paddingX: "48px", paddingY: "20px"
        }}>
          <Grid
            container
            direction="row"
            alignItems="center"
            padding={0}
            rowGap={0}
            spacing={0}
            columns={12}
            height={1}
          ><Grid padding={0} marginTop={"10px"} sx={{
            // backgroundColor: "#ddA3DA",
          }}>
              <Typography color={"#FBF9F9"} fontWeight={"bold"} align="left" textTransform={"uppercase"} margin={0} padding={0} fontSize={"50px"} lineHeight={1.0}>
                Next matches
              </Typography>
            </Grid>
          </Grid>

        </Grid>

        {commingMatches.filter(e => {
          // return !e.isFinalized
          return true
        }).map((match) => (
          <Grid key={match.matchId} width={1} height={88} padding={0} sx={{
            backgroundColor: "rgba(233, 237, 233, 0.9)", borderColor: "#000000",
            borderRadius: "15px", paddingX: "48px", paddingY: "20px"
          }}>
            {formattedMatch(match)}
          </Grid>
        ))}
      </Grid>}
    </div >
  );
};

const formattedMatch = (match: AdminMatch): React.JSX.Element => {
  const formattedTime = timestampToStringHours(match.startTime)
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      padding={0}
      rowGap={0}
      spacing={0}
      columns={12}
      height={1}
    >
      <Grid size={3} padding={0} marginTop={"10px"} sx={{
        // backgroundColor: "#ddA3DA",
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Typography color={"#000000"} fontWeight={"bold"} align="left" textTransform={"uppercase"} margin={0} padding={0} fontSize={"24px"} lineHeight={1.0}>
          {match.matchCategory + " - " + (match.matchGroup !== "" ? (" Group " + match.matchGroup) : match.name)}
        </Typography>
      </Grid>
      <Grid size={4} padding={0} marginTop={"10px"} sx={{
        // backgroundColor: "#ddA3DA",
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Grid
          direction="column"
        >
          <Grid>
            {match.homeTeam.player1}
          </Grid>
          <Grid>
            {match.homeTeam.player2}
          </Grid>
        </Grid>
      </Grid>
      <Grid size={1} padding={0} marginTop={"10px"} sx={{
        // backgroundColor: "#ddA3DA",
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Typography color={"#000000"} fontWeight={"bold"} align="left" textTransform={"uppercase"} margin={0} padding={0} fontSize={"24px"} lineHeight={1.0}>
          {formattedTime}
        </Typography>
      </Grid>
      <Grid size={4} padding={0} marginTop={"10px"} sx={{
        // backgroundColor: "#ddA3DA",
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Grid
          direction="column"
        >
          <Grid>
            {match.awayTeam.player1}
          </Grid>
          <Grid>
            {match.awayTeam.player2}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export const getCurrentMatch = (matches: AdminMatch[], courtID: string): AdminMatch | undefined => {
  return matches.filter(e => !e.hasWinner && !e.isFinalized && e.isStarted && e.arenaName === courtID)[0]
}

export const getCommingMatches = (matches: AdminMatch[], courtID: string): AdminMatch[] => {
  console.log(matches)
  return matches.filter(e => !e.hasWinner && !e.isFinalized && !e.isStarted && e.arenaName === courtID).sort(
    (a, b) => (a.startTime - b.startTime)
  ).slice(0, 5)
}

export default TournamentOverlay;
