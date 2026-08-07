import {
  QueryFieldFilterConstraint,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch } from "../components/tournamentAdmin/types";
import { TeamType } from "../components/types";
import { RootState } from "../store/store";
import { fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";
import { timestampToStringHours } from "../util/time";
import { getInitials } from "../util/names";
import { getCurrentMatch, getCommingMatches } from "./TournamentOverlay";

const normalizeColor = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(trimmed)) return `#${trimmed}`;
  return trimmed;
};

// Every element that carries a team color also gets a fixed light outline
// (via boxShadow) so it stays legible even when the team color is black
// or near-black — the shape is never dependent on the color for contrast.
const ACCENT_RING = "0 0 0 1px rgba(255,255,255,0.35)";

const demoCurrentMatch: AdminMatch = {
  matchId: 9001,
  awayTeam: { isWinner: false, name: "Team North", player1: "Ava Nord", player2: "Mia Berg" },
  currentScore: [
    { [TeamType.Home]: 21, [TeamType.Away]: 18 },
    { [TeamType.Home]: 18, [TeamType.Away]: 16 },
  ],
  currentSetScore: { [TeamType.Home]: 1, [TeamType.Away]: 0 },
  sets: [{ [TeamType.Home]: 21, [TeamType.Away]: 18 }],
  startTime: Date.now() - 20 * 60 * 1000,
  startTimestamp: Date.now() - 20 * 60 * 1000,
  arenaName: "Center Court",
  hasWinner: false,
  isFinalized: false,
  isStarted: true,
  referee: "Demo Ref",
  homeTeam: { isWinner: false, name: "Team South", player1: "Noah Strand", player2: "Elias Vik" },
  matchCategory: "Men",
  matchGroup: "A",
  name: "Semi Final",
  scoreboardID: "",
};

const demoUpcomingMatches: AdminMatch[] = [
  { ...demoCurrentMatch, matchId: 9002, isStarted: false, currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }], currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 }, sets: [], startTime: Date.now() + 10 * 60 * 1000, homeTeam: { isWinner: false, name: "", player1: "Luna Sol", player2: "Kari Moe" }, awayTeam: { isWinner: false, name: "", player1: "Iben Rye", player2: "Sara Lien" }, matchCategory: "Women", matchGroup: "B", name: "" },
  { ...demoCurrentMatch, matchId: 9003, isStarted: false, currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }], currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 }, sets: [], startTime: Date.now() + 25 * 60 * 1000, homeTeam: { isWinner: false, name: "", player1: "Per Holm", player2: "Mads Ny" }, awayTeam: { isWinner: false, name: "", player1: "Theo Lin", player2: "Ola Nybo" }, matchCategory: "Mixed", matchGroup: "C", name: "" },
  { ...demoCurrentMatch, matchId: 9004, isStarted: false, currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }], currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 }, sets: [], startTime: Date.now() + 45 * 60 * 1000, homeTeam: { isWinner: false, name: "", player1: "Mila Tor", player2: "Runa Sve" }, awayTeam: { isWinner: false, name: "", player1: "Nora Vin", player2: "Tina Ask" }, matchCategory: "Women", matchGroup: "D", name: "" },
  { ...demoCurrentMatch, matchId: 9005, isStarted: false, currentScore: [{ [TeamType.Home]: 0, [TeamType.Away]: 0 }], currentSetScore: { [TeamType.Home]: 0, [TeamType.Away]: 0 }, sets: [], startTime: Date.now() + 70 * 60 * 1000, homeTeam: { isWinner: false, name: "", player1: "Odin Rey", player2: "Knut Sol" }, awayTeam: { isWinner: false, name: "", player1: "Vera Lim", player2: "Ylva Vang" }, matchCategory: "Men", matchGroup: "E", name: "" },
];

export default function TournamentDisplay() {
  const location = useLocation();
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);
  const [homeColor, setHomeColor] = useState<string>("");
  const [awayColor, setAwayColor] = useState<string>("");
  const hadCurrentMatchRef = useRef(false);
  const currentMatchIdRef = useRef<string>("");

  const queryParams = new URLSearchParams(location.search);
  const tournamentSlug = queryParams.get("tournamentId");
  const isDemoMode = !tournamentSlug || tournamentSlug === "demo";
  const courtID = queryParams.get("courtId");
  const noDate = queryParams.get("noDate");

  const dispatch = useDispatch();
  const db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE);

  const matches = useSelector((state: RootState) => state.matches.matches);
  const matchesList = Object.values(matches);

  if (!isDemoMode && !fetchedMatches && tournamentSlug) {
    dispatch(fetchMatchesRequest({ tournamentSlug, class: null }));
    setFetchedMatches(true);
  }

  if (!isDemoMode && !createdCallbacks && tournamentSlug) {
    const currentDate = new Date().toISOString().split("T")[0];
    const collectionQuery: QueryFieldFilterConstraint[] = [];
    if (noDate === null) collectionQuery.push(where("Date", "==", currentDate));
    if (courtID != null) collectionQuery.push(where("Field.Name", "==", courtID));
    collectionQuery.push(where("HasWinner", "==", false));
    const q = query(collection(db, "Tournaments", tournamentSlug, "Matches"), ...collectionQuery);
    setCreatedCallbacks(true);
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (data) {
          const updatedMatch = parseAdminMatch(data);
          dispatch(updateMatch({ match: updatedMatch, matchId: updatedMatch.matchId }));
        }
      });
    });
  }

  const currentMatch = isDemoMode ? demoCurrentMatch : getCurrentMatch(matchesList, courtID || "");
  const upcomingMatches = isDemoMode ? demoUpcomingMatches : getCommingMatches(matchesList, courtID || "");

  const latestScore = currentMatch?.currentScore?.[currentMatch.currentScore.length - 1];
  const homeSetScore = currentMatch?.currentSetScore?.[TeamType.Home] ?? 0;
  const awaySetScore = currentMatch?.currentSetScore?.[TeamType.Away] ?? 0;
  const homeScore = latestScore?.[TeamType.Home] ?? 0;
  const awayScore = latestScore?.[TeamType.Away] ?? 0;
  const currentSet = (currentMatch?.sets?.length ?? 0) + 1;

  useEffect(() => {
    const matchId = currentMatch?.scoreboardID?.trim();
    if (!currentMatch || isDemoMode || !matchId) {
      hadCurrentMatchRef.current = false;
      currentMatchIdRef.current = "";
      setHomeColor("");
      setAwayColor("");
      return;
    }
    const isNew = !hadCurrentMatchRef.current || currentMatchIdRef.current !== matchId;
    hadCurrentMatchRef.current = true;
    currentMatchIdRef.current = matchId;
    if (!isNew) return;
    const fetchColors = async () => {
      try {
        const matchDoc = await getDoc(doc(db, "Matches", matchId));
        if (!matchDoc.exists()) { setHomeColor(""); setAwayColor(""); return; }
        const data = matchDoc.data();
        setHomeColor(normalizeColor(data.homeColor));
        setAwayColor(normalizeColor(data.awayColor));
      } catch {
        setHomeColor(""); setAwayColor("");
      }
    };
    fetchColors();
  }, [currentMatch, db, isDemoMode]);

  const homeAccent = homeColor || "#00A30A";
  const awayAccent = awayColor || "#da0000";

  // Left-hand meta line now folds category, group/name, and the current set
  // number into a single string, e.g. "Men · Group A · Set 2"
  const matchMeta = currentMatch
    ? [
        currentMatch.matchCategory,
        currentMatch.matchGroup ? `Group ${currentMatch.matchGroup}` : currentMatch.name || "",
        `Set ${currentSet}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  // Right-hand header label: prefer the explicit court query param, fall
  // back to the current match's arena name.
  const courtLabel = courtID || currentMatch?.arenaName || "";

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", color: "#fff" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(8px,1.2vh,20px) clamp(16px,2.5vw,48px)", background: "#111827", borderBottom: "2px solid rgba(0,163,218,0.25)", flexShrink: 0, gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px,1.2vw,24px)", flexWrap: "wrap" }}>
          {currentMatch && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "clamp(8px,0.8vw,12px)", height: "clamp(8px,0.8vw,12px)", borderRadius: "50%", background: "#ff3b3b", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: "clamp(0.65rem,0.9vw,1rem)", fontWeight: 700, letterSpacing: "0.12em", color: "#ff3b3b", textTransform: "uppercase" }}>Live</span>
            </div>
          )}
          {matchMeta && <span style={{ fontSize: "clamp(0.65rem,1vw,1.1rem)", color: "#4b6a8a", textTransform: "uppercase", letterSpacing: "0.05em" }}>{matchMeta}</span>}
          {isDemoMode && <span style={{ fontSize: "clamp(0.6rem,0.85vw,0.9rem)", color: "#555", fontStyle: "italic" }}>demo mode</span>}
        </div>
        {courtLabel && (
          <span style={{ fontSize: "clamp(1rem,1.8vw,2.2rem)", fontWeight: 800, color: "#00A3DA", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
            {courtLabel}
          </span>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {currentMatch ? (
          <>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: "clamp(8px,1.5vh,20px) clamp(16px,3vw,48px)", gap: "clamp(6px,1vh,16px)", justifyContent: "center" }}>

              {/* Shared grid so the names/sets row and the score row share the same center line */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", columnGap: "clamp(16px,3vw,40px)", rowGap: "clamp(12px,2vh,28px)" }}>

                {/* Home: names (padded off the edge), sets box (closest to center) */}
                <div style={{ justifySelf: "stretch", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(16px,2.5vw,36px)", paddingLeft: "clamp(24px,4vw,72px)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px,0.8vh,14px)" }}>
                    <span style={{ fontSize: "clamp(2.2rem,4.3vmin,6rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.1 }}>{getInitials(currentMatch.homeTeam.player1)}</span>
                    <span style={{ fontSize: "clamp(2.2rem,4.3vmin,6rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.1 }}>{getInitials(currentMatch.homeTeam.player2)}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", border: `clamp(4px,0.6vw,8px) solid ${homeAccent}`, boxShadow: ACCENT_RING, borderRadius: "clamp(10px,1.2vw,20px)", width: "clamp(130px,16vw,240px)", aspectRatio: "1", flexShrink: 0 }}>
                    <span style={{ fontSize: "clamp(0.85rem,1.3vw,1.6rem)", color: "#4b6a8a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sets</span>
                    <span style={{ fontSize: "clamp(4.5rem,9vw,9rem)", fontWeight: 900, color: "#fff", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{homeSetScore}</span>
                  </div>
                </div>

                <span style={{ justifySelf: "center", fontSize: "clamp(0.6rem,0.9vw,1rem)", color: "#333" }}>vs</span>

                {/* Away: sets box (closest to center), names (padded off the edge) */}
                <div style={{ justifySelf: "stretch", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(16px,2.5vw,36px)", paddingRight: "clamp(24px,4vw,72px)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", border: `clamp(4px,0.6vw,8px) solid ${awayAccent}`, boxShadow: ACCENT_RING, borderRadius: "clamp(10px,1.2vw,20px)", width: "clamp(130px,16vw,240px)", aspectRatio: "1", flexShrink: 0 }}>
                    <span style={{ fontSize: "clamp(0.85rem,1.3vw,1.6rem)", color: "#4b6a8a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sets</span>
                    <span style={{ fontSize: "clamp(4.5rem,9vw,9rem)", fontWeight: 900, color: "#fff", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{awaySetScore}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "clamp(6px,0.8vh,14px)" }}>
                    <span style={{ fontSize: "clamp(2.2rem,4.3vmin,6rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.1 }}>{getInitials(currentMatch.awayTeam.player1)}</span>
                    <span style={{ fontSize: "clamp(2.2rem,4.3vmin,6rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.1 }}>{getInitials(currentMatch.awayTeam.player2)}</span>
                  </div>
                </div>

                {/* Home score */}
                <div style={{ justifySelf: "end", borderLeft: `clamp(6px,1.2vw,16px) solid ${homeAccent}`, boxShadow: `inset 2px 0 0 rgba(255,255,255,0.35)`, padding: "clamp(8px,1.5vh,20px) clamp(16px,2.5vw,40px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "clamp(8rem,40vmin,62rem)", fontWeight: 900, color: "#fff", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{homeScore}</span>
                </div>

                <span style={{ justifySelf: "center", fontSize: "clamp(2rem,6vmin,8rem)", fontWeight: 700, color: "rgba(255,255,255,0.15)" }}>–</span>

                {/* Away score */}
                <div style={{ justifySelf: "start", borderRight: `clamp(6px,1.2vw,16px) solid ${awayAccent}`, boxShadow: `inset -2px 0 0 rgba(255,255,255,0.35)`, padding: "clamp(8px,1.5vh,20px) clamp(16px,2.5vw,40px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "clamp(8rem,40vmin,62rem)", fontWeight: 900, color: "#fff", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{awayScore}</span>
                </div>
              </div>

              {/* Completed sets */}
              {currentMatch.sets.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(8px,1.5vw,24px)", flexShrink: 0, flexWrap: "wrap" }}>
                  {currentMatch.sets.map((set, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "clamp(6px,0.8vh,14px) clamp(16px,2vw,32px)", textAlign: "center" }}>
                      <span style={{ fontSize: "clamp(0.75rem,1.1vw,1.3rem)", color: "#4b6a8a", display: "block", textTransform: "uppercase", letterSpacing: "0.08em" }}>S{i + 1}</span>
                      <span style={{ fontSize: "clamp(1.4rem,2.4vw,3.2rem)", fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#888" }}>{set[TeamType.Home]}–{set[TeamType.Away]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming strip */}
            {upcomingMatches.length > 0 && (
              <div style={{ flexShrink: 0, background: "#0a0f18", borderTop: "1px solid #1a2333", padding: "clamp(8px,1.2vh,20px) clamp(16px,2.5vw,48px)", display: "flex", alignItems: "center", gap: "clamp(12px,1.8vw,28px)", overflow: "hidden" }}>
                <span style={{ fontSize: "clamp(0.6rem,0.8vw,0.9rem)", fontWeight: 700, color: "#4b6a8a", letterSpacing: "0.16em", textTransform: "uppercase", flexShrink: 0 }}>Next up</span>
                {upcomingMatches.slice(0, 4).map((match) => <UpcomingChip key={match.matchId} match={match} />)}
              </div>
            )}
          </>
        ) : (
          /* No current match — full upcoming list */
          <div style={{ flex: 1, padding: "clamp(16px,2.5vh,48px) clamp(16px,3vw,56px)", display: "flex", flexDirection: "column", gap: "clamp(8px,1.4vh,20px)", overflow: "hidden" }}>
            <div style={{ fontSize: "clamp(1.4rem,2.8vw,3.5rem)", fontWeight: 900, color: "#00A3DA", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
              Upcoming matches
              {courtID && <span style={{ fontSize: "clamp(0.8rem,1.4vw,1.8rem)", color: "#555", marginLeft: "clamp(8px,1vw,18px)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{courtID}</span>}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "clamp(6px,1vh,14px)", overflow: "hidden" }}>
              {upcomingMatches.length === 0
                ? <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(1rem,2vw,2.2rem)", color: "#333" }}>No upcoming matches</div>
                : upcomingMatches.map((match, i) => <UpcomingRow key={match.matchId} match={match} highlight={i === 0} />)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingChip({ match }: { match: AdminMatch }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px,0.7vw,12px)", background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "clamp(4px,0.5vh,8px) clamp(8px,1.1vw,18px)", flexShrink: 0 }}>
      <span style={{ fontSize: "clamp(0.65rem,0.9vw,1rem)", color: "#00A3DA", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{timestampToStringHours(match.startTime)}</span>
      <span style={{ fontSize: "clamp(0.55rem,0.7vw,0.8rem)", color: "#4b6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>{match.matchCategory}{match.matchGroup ? ` – ${match.matchGroup}` : match.name ? ` – ${match.name}` : ""}</span>
      <span style={{ fontSize: "clamp(0.65rem,0.9vw,1rem)", color: "#ccc" }}>{getInitials(match.homeTeam.player1)} / {getInitials(match.homeTeam.player2)}</span>
      <span style={{ fontSize: "clamp(0.55rem,0.7vw,0.8rem)", color: "#333" }}>vs</span>
      <span style={{ fontSize: "clamp(0.65rem,0.9vw,1rem)", color: "#ccc" }}>{getInitials(match.awayTeam.player1)} / {getInitials(match.awayTeam.player2)}</span>
    </div>
  );
}

function UpcomingRow({ match, highlight }: { match: AdminMatch; highlight: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", background: highlight ? "rgba(0,163,218,0.1)" : "rgba(255,255,255,0.04)", borderRadius: "clamp(8px,0.8vw,14px)", padding: "clamp(12px,1.8vh,28px) clamp(16px,2.5vw,40px)", borderLeft: `clamp(4px,0.4vw,7px) solid ${highlight ? "#00A3DA" : "rgba(255,255,255,0.08)"}`, gap: "clamp(12px,2vw,36px)", flexShrink: 0 }}>
      <span style={{ fontSize: "clamp(1.2rem,2.4vw,3.2rem)", color: "#00A3DA", fontFamily: "'DM Mono', monospace", fontWeight: 700, flexShrink: 0, minWidth: "clamp(60px,7vw,110px)" }}>{timestampToStringHours(match.startTime)}</span>
      <span style={{ fontSize: "clamp(0.8rem,1.4vw,1.8rem)", color: "#4b6a8a", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, minWidth: "clamp(200px,28vw,460px)" }}>{match.matchCategory}{match.matchGroup ? ` – Group ${match.matchGroup}` : match.name ? ` – ${match.name}` : ""}</span>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "clamp(2px,0.4vh,6px)", minWidth: 0 }}>
        <span style={{ fontSize: "clamp(1.1rem,2.2vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{getInitials(match.homeTeam.player1)} / {getInitials(match.homeTeam.player2)}</span>
        <span style={{ fontSize: "clamp(0.7rem,1.1vw,1.4rem)", color: "#333", fontWeight: 700, lineHeight: 1 }}>vs</span>
        <span style={{ fontSize: "clamp(1.1rem,2.2vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{getInitials(match.awayTeam.player1)} / {getInitials(match.awayTeam.player2)}</span>
      </div>
      {match.arenaName && <span style={{ fontSize: "clamp(0.7rem,1.2vw,1.4rem)", color: "#444", flexShrink: 0 }}>{match.arenaName}</span>}
    </div>
  );
}