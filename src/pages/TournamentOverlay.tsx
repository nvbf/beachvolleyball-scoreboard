import { Grid, Typography } from "@mui/material";
import { QueryFieldFilterConstraint, collection, doc, getDoc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import { parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch } from "../components/tournamentAdmin/types";
import { TeamType } from "../components/types";
import { getInitials } from "../util/names";
import { fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";
import { timestampToStringHours } from "../util/time";

const normalizeColor = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(trimmed)) {
    return `#${trimmed}`;
  }

  return trimmed;
};

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

export default function TournamentOverlay() {
  const location = useLocation();
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);
  const [showDemoCurrentMatch, setShowDemoCurrentMatch] = useState(true);
  const [homeColor, setHomeColor] = useState<string>("");
  const [awayColor, setAwayColor] = useState<string>("");
  const hadCurrentMatchRef = useRef(false);
  const currentMatchIdRef = useRef<string>("");
  const queryParams = new URLSearchParams(location.search);
  const tournamentSlug = queryParams.get("tournamentId") || "default";
  const isDemoMode = tournamentSlug === "demo";
  const courtID = queryParams.get("courtId");
  const noDate = queryParams.get('noDate');

  const dispatch = useDispatch();
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE)

  const matches = useSelector((state: RootState) => state.matches.matches);
  const matchesList = Object.values(matches);

  if (!isDemoMode && !fetchedMatches && tournamentSlug) {
    dispatch(fetchMatchesRequest({ tournamentSlug: tournamentSlug, class: null }));
    setFetchedMatches(true)
  }

  useEffect(() => {
    const originalBodyBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'transparent';
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
  const latestScore = currentMatch?.currentScore?.[currentMatch.currentScore.length - 1]
  const homeSetScore = currentMatch?.currentSetScore?.[TeamType.Home] ?? 0
  const awaySetScore = currentMatch?.currentSetScore?.[TeamType.Away] ?? 0
  const homeScore = latestScore?.[TeamType.Home] ?? 0
  const awayScore = latestScore?.[TeamType.Away] ?? 0

  useEffect(() => {
    const matchId = currentMatch?.scoreboardID?.trim();

    if (!currentMatch) {
      hadCurrentMatchRef.current = false;
      currentMatchIdRef.current = "";
      setHomeColor("");
      setAwayColor("");
      return;
    }

    const startedCurrentMatch = !hadCurrentMatchRef.current && currentMatch;
    const switchedCurrentMatch = currentMatchIdRef.current !== matchId;

    hadCurrentMatchRef.current = true;
    currentMatchIdRef.current = matchId || "";

    if (!matchId || (!startedCurrentMatch && !switchedCurrentMatch)) {
      return;
    }

    const fetchColors = async () => {
      try {
        const matchDocRef = doc(db, "Matches", matchId);
        const matchDoc = await getDoc(matchDocRef);

        if (!matchDoc.exists()) {
          setHomeColor("");
          setAwayColor("");
          return;
        }

        const data = matchDoc.data();
        const homeColor = normalizeColor(data.homeColor);
        const awayColor = normalizeColor(data.awayColor);

        if (homeColor || awayColor) {
          console.log("Found match colors for %s: home=%s away=%s", matchId, homeColor || "<not set>", awayColor || "<not set>");
        }
        console.log("Setting match color state for %s: home=%s away=%s", matchId, homeColor || "<empty>", awayColor || "<empty>");
        setHomeColor(homeColor);
        setAwayColor(awayColor);
      } catch (error) {
        console.error("Unable to fetch match colors", error);
        setHomeColor("");
        setAwayColor("");
      }
    };

    fetchColors();

    return () => { };
  }, [currentMatch, db]);

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        backgroundColor: 'rgba(0, 0, 0, 0)',
        textAlign: "center",
        width: '1920px', height: '1080px'
      }}
    >
      {/* ── Live scoreboard ── */}
      {currentMatch && (
        <div style={{
          position: "absolute",
          width: "100%",
          bottom: "60px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "stretch", fontFamily: "'DM Sans', sans-serif" }}>

            {/* Left cap — home team */}
            <div style={{
              background: "rgba(0,0,0,0.85)",
              padding: "10px 24px 10px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              minWidth: "180px",
              borderRadius: "50px 0 0 50px",
              borderRight: `2px solid ${homeColor}`,
              borderLeft: `22px solid ${homeColor}`,
            }}>
              <span style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", lineHeight: 1.3 }}>
                {getInitials(currentMatch.homeTeam.player1)}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", lineHeight: 1.3 }}>
                {getInitials(currentMatch.homeTeam.player2)}
              </span>
            </div>

            {/* Home sets */}
            <div style={{
              background: "#00A3DA",
              color: "#fff",
              padding: "6px 4px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "56px",
            }}>
              <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>SETS</span>
              <span style={{ fontSize: "36px", fontWeight: 900, fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>{homeSetScore}</span>
            </div>

            {/* Score */}
            <div style={{
              background: "rgba(0,0,0,0.9)",
              padding: "6px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <span style={{ fontSize: "36px", fontWeight: 900, fontFamily: "'DM Mono', monospace", color: "#fff" }}>{homeScore}</span>
              <span style={{ fontSize: "22px", fontWeight: 900, color: "#fff", fontFamily: "'DM Mono', monospace" }}>–</span>
              <span style={{ fontSize: "36px", fontWeight: 900, fontFamily: "'DM Mono', monospace", color: "#fff" }}>{awayScore}</span>
            </div>

            {/* Away sets */}
            <div style={{
              background: "#00A3DA",
              color: "#fff",
              padding: "6px 4px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "56px",
            }}>
              <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>SETS</span>
              <span style={{ fontSize: "36px", fontWeight: 900, fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>{awaySetScore}</span>
            </div>

            {/* Right cap — away team */}
            <div style={{
              background: "rgba(0,0,0,0.85)",
              padding: "10px 28px 10px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              minWidth: "180px",
              borderRadius: "0 50px 50px 0",
              borderLeft: `2px solid ${awayColor}`,
              borderRight: `22px solid ${awayColor}`,
            }}>
              <span style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", lineHeight: 1.3 }}>
                {getInitials(currentMatch.awayTeam.player1)}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", lineHeight: 1.3 }}>
                {getInitials(currentMatch.awayTeam.player2)}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ── Upcoming matches ── */}
      {!currentMatch && <Grid
        container
        direction="column"
        padding={0}
        rowGap={2}
        spacing={0}
        columns={12}
        sx={{
          position: "absolute",
          width: "887px",
          bottom: "0",
          left: "25%",
          top: "167px",
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
          ><Grid padding={0} marginTop={"10px"} sx={{}}>
              <Typography color={"#FBF9F9"} fontWeight={"bold"} align="left" textTransform={"uppercase"} margin={0} padding={0} fontSize={"50px"} lineHeight={1.0}>
                Next matches
              </Typography>
            </Grid>
          </Grid>

        </Grid>

        {commingMatches.filter(e => {
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
    </div>
  );
}

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
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Typography color={"#000000"} fontWeight={"bold"} align="left" textTransform={"uppercase"} margin={0} padding={0} fontSize={"24px"} lineHeight={1.0}>
          {match.matchCategory + " - " + (match.matchGroup !== "" ? (" Group " + match.matchGroup) : match.name)}
        </Typography>
      </Grid>
      <Grid size={4} padding={0} marginTop={"10px"} sx={{
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Grid direction="column">
          <Grid>{match.homeTeam.player1}</Grid>
          <Grid>{match.homeTeam.player2}</Grid>
        </Grid>
      </Grid>
      <Grid size={1} padding={0} marginTop={"10px"} sx={{
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Typography color={"#000000"} fontWeight={"bold"} align="left" textTransform={"uppercase"} margin={0} padding={0} fontSize={"24px"} lineHeight={1.0}>
          {formattedTime}
        </Typography>
      </Grid>
      <Grid size={4} padding={0} marginTop={"10px"} sx={{
        borderColor: "#000000", borderWidth: "2px",
      }}>
        <Grid direction="column">
          <Grid>{match.awayTeam.player1}</Grid>
          <Grid>{match.awayTeam.player2}</Grid>
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
