import { Grid, Typography } from "@mui/material";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import { fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/action";
import { parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch } from "../components/tournamentAdmin/types";
import { TeamType } from "../components/types";
import { getInitials } from "../util/names";

const TournamentOverlay = () => {
  const location = useLocation();
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);
  // Extract the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tournamentSlug = queryParams.get("tournamentId") || "default";
  const courtID = queryParams.get("courtId") || "default";
  const numberSize = 32
  const nameSize = 12

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
  // Hardcoded mapping of IDs to names
  const tournamentNames = {
    "12321": "Oslo Masters",
    default: "Unknown Tournament",
  };
  const matchNames = { "12333": "Gruppespill A", default: "Unknown Match" };
  const courtNames = { "1222": "Bane 1", default: "Unknown Court" };

  // Players and scores
  const player1 = "Player1";
  const player2 = "Player2";
  const player3 = "Player3";
  const player4 = "Player4";
  const scoreTeam1 = 15;
  const scoreTeam2 = 20;


  const currentMatch = getCurrentMatch(matchesList, courtID)

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        padding: "10px",
        backgroundColor: 'rgba(52, 52, 52, 0.0)',        // backgroundColor: "rgba(0,0,0,0.7)",
        textAlign: "center",
        width: '1920px', height: '1080px'
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
        <Grid item height={60} padding={0} sx={{
          backgroundColor: "#ffffff", borderColor: "#000000",
          border: 2,
        }}
        >
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
            <Grid item
              padding={0}
            >
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.4}>
                {currentMatch ? `${getInitials(currentMatch.homeTeam.player1)}` : ""}
              </Typography>
            </Grid>
            <Grid item
              padding={0}
            >
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.0}>
                {currentMatch ? `${getInitials(currentMatch.homeTeam.player2)}` : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item height={60} sx={{
          borderColor: "#000000",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}
        >
          <Grid
            container
            // spacing={1}
            paddingY={0.5}
            paddingX={2}
            columns={12}
            direction={"column"}
          >
            <Grid item padding={0} margin={0}>
              <Typography textTransform={"uppercase"} fontSize={8} padding={0} margin={0} noWrap>
                sets
              </Typography>
            </Grid>
            <Grid item padding={0} margin={0}>
              <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
                {currentMatch ? currentMatch.currentSetScore[TeamType.Home] : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item height={60} sx={{
          backgroundColor: "#ffffff",
          borderColor: "#000000",
          border: 2,
        }}
        >
          <Grid
            container
            height={1}
            spacing={1}
            padding={0.5}

          // padding={1}
          >
            <Grid item height={1}>
              <Typography fontSize={numberSize}>
                {currentMatch ? currentMatch.currentScore[currentMatch.currentScore.length - 1][TeamType.Home] : ""}

              </Typography>
            </Grid>
            <Grid item>
              <Typography fontSize={numberSize}>
                -
              </Typography>
            </Grid>
            <Grid item>
              <Typography fontSize={numberSize}>
                {currentMatch ? currentMatch.currentScore[currentMatch.currentScore.length - 1][TeamType.Away] : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item height={60} sx={{
          borderColor: "#000000",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}
        >
          <Grid
            container
            // spacing={1}
            paddingY={0.5}
            paddingX={2}
            columns={12}
            direction={"column"}
          >
            <Grid item padding={0} margin={0}>
              <Typography textTransform={"uppercase"} fontSize={8} padding={0} margin={0} noWrap>
                sets
              </Typography>
            </Grid>
            <Grid item padding={0} margin={0}>
              <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
                {currentMatch ? currentMatch.currentSetScore[TeamType.Away] : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item height={60}
          sx={{
            backgroundColor: "#ffffff",
            borderColor: "#000000",
            border: 2,
          }}
        >
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
            <Grid item
              padding={0}
            >
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.4}>
                {currentMatch ? `${getInitials(currentMatch.awayTeam.player1)}` : ""}
              </Typography>
            </Grid>
            <Grid item
              padding={0}
            >
              <Typography textTransform={"uppercase"} padding={0} fontSize={nameSize} lineHeight={1.0}>
                {currentMatch ? `${getInitials(currentMatch.awayTeam.player2)}` : ""}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>}
    </div>
  );
};
export const getCurrentMatch = (matches: AdminMatch[], courtID: string): AdminMatch => {
  return matches.filter(e => !e.hasWinner && !e.isFinalized && e.isStarted && e.arenaName === courtID)[0]
}

export default TournamentOverlay;
