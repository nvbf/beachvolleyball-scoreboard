import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../store/store";
import MatchView from "../components/tournamentAdmin/matchView";
import { Alert, Box, Grid, Link, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { QueryFieldFilterConstraint, collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getMatchState, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { dateStringToString } from "../util/time";
import { chooseCourt, chooseDay, fetchMatchSecrets, fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";
import { useNavigate } from 'react-router-dom';
import Loader from "../components/loader";
import { colors, statusColors } from "../theme";
import { SwapVert } from "@mui/icons-material";

// ─── Pill toggle ─────────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  count: number;
  active: boolean;
  statusKey: "ongoing" | "upcoming" | "finished" | "reported" | "neutral";
  onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ label, count, active, statusKey, onClick }) => {
  const s = statusKey !== "neutral" ? statusColors[statusKey] : null;

  const activeBg = s ? s.pillBg : "#e8e2d8";
  const activeBorder = s ? s.pillBorder : "#7a6e60";
  const activeText = s ? s.pillText : "#3a3228";
  const activeCnt = s ? s.dot : "#7a6e60";

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        fontWeight: 600,
        px: "11px",
        py: "5px",
        borderRadius: "20px",
        cursor: "pointer",
        border: `1.5px solid ${active ? activeBorder : colors.inactivePillBorder}`,
        backgroundColor: active ? activeBg : colors.inactivePillBg,
        color: active ? activeText : colors.inactivePillText,
        userSelect: "none",
        transition: "all 0.12s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <Box
        sx={{
          fontSize: "10px",
          fontWeight: 700,
          px: "5px",
          borderRadius: "10px",
          lineHeight: "16px",
          backgroundColor: active ? activeCnt : colors.inactiveCntBg,
          color: "#fff",
          minWidth: "18px",
          textAlign: "center",
        }}
      >
        {count}
      </Box>
    </Box>
  );
};

// ─── Filter chip (day / court) ────────────────────────────────────────────────

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "11px",
      fontWeight: 500,
      px: "9px",
      py: "5px",
      borderRadius: "5px",
      cursor: "pointer",
      border: `1.5px solid ${active ? colors.textMuted : colors.inactivePillBorder}`,
      backgroundColor: active ? colors.metaBg : colors.inactivePillBg,
      color: active ? colors.textPrimary : colors.inactivePillText,
      userSelect: "none",
      transition: "all 0.12s",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </Box>
);

// ─── Day / court selector row ─────────────────────────────────────────────────

interface SelectorRowProps {
  items: string[];
  selected: string;
  allLabel: string;
  format?: (s: string) => string;
  onSelect: (val: string) => void;
}

const SelectorRow: React.FC<SelectorRowProps> = ({ items, selected, allLabel, format, onSelect }) => (
  <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
    <FilterChip label={allLabel} active={selected === "all"} onClick={() => onSelect("all")} />
    {items.map((item) => (
      <FilterChip
        key={item}
        label={format ? format(item) : item}
        active={selected === item}
        onClick={() => onSelect(item)}
      />
    ))}
  </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

const TournamentAdmin = () => {
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);

  const [seeUpcoming, setSeeUpcoming] = useState(true);
  const [seeOngoing, setSeeOngoing] = useState(true);
  const [seeFinished, setSeeFinished] = useState(true);
  const [seeReported, setSeeReported] = useState(false);
  const [descending, setDescending] = useState(true);
  const [selectDay, setSelectDay] = useState(false);
  const [selectCourt, setSelectCourt] = useState(false);

  const navigate = useNavigate();
  const tournamentSlug: string = params.tournamentSlug ?? "";
  const selectedPlayerClass = searchParams.get('class');

  function handleSelectDay(day: string) {
    dispatch(chooseDay(day));
    setSelectDay(false);
  }

  function handleSelectCourt(court: string) {
    dispatch(chooseCourt(court));
    setSelectCourt(false);
  }

  useEffect(() => {
    const fetchData = async (slug: string) => {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/sync/v1/tournament/${slug}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (tournamentSlug) fetchData(tournamentSlug);
    const intervalId = setInterval(fetchData, 360000, tournamentSlug);
    return () => clearInterval(intervalId);
  }, [tournamentSlug]);

  const dispatch = useDispatch();
  const db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE);
  const matches = useSelector((state: RootState) => state.matches);
  const matchesList: AdminMatch[] = Object.values(matches.matches);

  if (!fetchedMatches && tournamentSlug) {
    setFetchedMatches(true);
    dispatch(fetchMatchesRequest({ tournamentSlug, class: selectedPlayerClass }));
    dispatch(fetchMatchSecrets({ tournamentSlug, class: selectedPlayerClass }));
  }

  if (!createdCallbacks && tournamentSlug) {
    const currentDate = new Date().toISOString().split('T')[0];
    const collectionQuery: QueryFieldFilterConstraint[] = [
      where("Date", "==", currentDate),
      where("HasWinner", "==", false),
    ];
    if (selectedPlayerClass != null) {
      collectionQuery.push(where("MatchCategory.CategoryCode", "==", selectedPlayerClass));
    }
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

  const isUpcoming = (m: AdminMatch) => getMatchState(m) === MatchState.Upcoming;
  const isOngoing = (m: AdminMatch) => getMatchState(m) === MatchState.Ongoing;
  const isFinished = (m: AdminMatch) => getMatchState(m) === MatchState.Finished;
  const isReported = (m: AdminMatch) => getMatchState(m) === MatchState.Reported;

  const filteredByDayCourt = matchesList
    .filter(e => matches.selectedDay === "all" || new Date(e.startTime).toISOString().split('T')[0] === matches.selectedDay)
    .filter(e => matches.selectedCourt === "all" || e.arenaName === matches.selectedCourt);

  const upcomingCount = filteredByDayCourt.filter(isUpcoming).length;
  const ongoingCount = filteredByDayCourt.filter(isOngoing).length;
  const finishedCount = filteredByDayCourt.filter(isFinished).length;
  const reportedCount = filteredByDayCourt.filter(isReported).length;

  const renderMatches = (
    matches: AdminMatch[],
    tournamentSlug: string,
    descending: boolean,
    selectedDay: string,
    selectedCourt: string,
    secret: string
  ) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {matches
        .sort((a, b) => descending ? a.startTime - b.startTime : b.startTime - a.startTime)
        .filter(e =>
          (seeUpcoming && isUpcoming(e)) ||
          (seeOngoing && isOngoing(e)) ||
          (seeFinished && isFinished(e)) ||
          (seeReported && isReported(e))
        )
        .filter(e => selectedDay === "all" || new Date(e.startTime).toISOString().split('T')[0] === selectedDay)
        .filter(e => selectedCourt === "all" || e.arenaName === selectedCourt)
        .map((match, index) => (
          <MatchView key={index} match={match} tournamentSlug={tournamentSlug} secret={secret} />
        ))}
    </Box>
  );

  const renderNoAccess = () => (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Alert severity="warning">
        No access to admin for this tournament. Ask the owner for an authorization link.
      </Alert>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 1, sm: 2 }, pt: 1 }}>

      {matches.secret && (
        <>
          {/* ── Class filter ── */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", mb: "10px" }}>
            <Link
              href={`/tournamentadmin/${tournamentSlug}`}
              sx={{ fontSize: "12px", color: selectedPlayerClass === null ? colors.textPrimary : colors.textFaint, fontWeight: selectedPlayerClass === null ? 600 : 400, textDecoration: "none" }}
            >
              all classes
            </Link>
            {matches.classes.map((playerClass: string) => (
              <Link
                key={playerClass}
                href={`/tournamentadmin/${tournamentSlug}?class=${playerClass}`}
                sx={{ fontSize: "12px", color: playerClass === selectedPlayerClass ? colors.textPrimary : colors.textFaint, fontWeight: playerClass === selectedPlayerClass ? 600 : 400, textDecoration: "none" }}
              >
                {playerClass}
              </Link>
            ))}
          </Box>

          {/* ── Status toggles + sort ── */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", mb: "8px", alignItems: "center" }}>
            <Pill label="Upcoming" count={upcomingCount} active={seeUpcoming} statusKey="upcoming" onClick={() => setSeeUpcoming(!seeUpcoming)} />
            <Pill label="Ongoing" count={ongoingCount} active={seeOngoing} statusKey="ongoing" onClick={() => setSeeOngoing(!seeOngoing)} />
            <Pill label="Finished" count={finishedCount} active={seeFinished} statusKey="finished" onClick={() => setSeeFinished(!seeFinished)} />
            <Pill label="Reported" count={reportedCount} active={seeReported} statusKey="reported" onClick={() => setSeeReported(!seeReported)} />

            {/* Sort toggle */}
            <Box
              onClick={() => setDescending(!descending)}
              title={descending ? "Ascending" : "Descending"}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "20px",
                cursor: "pointer",
                border: `1.5px solid ${colors.inactivePillBorder}`,
                backgroundColor: colors.inactivePillBg,
                color: colors.inactivePillText,
                transition: "all 0.12s",
                transform: descending ? "none" : "scaleY(-1)",
              }}
            >
              <SwapVert sx={{ fontSize: "16px" }} />
            </Box>
          </Box>

          {/* ── Day / court filter row ── */}
          {!selectDay && !selectCourt && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", mb: "10px" }}>
              <FilterChip
                label={matches.selectedDay === "all" ? "Choose day" : dateStringToString(matches.selectedDay)}
                active={matches.selectedDay !== "all"}
                onClick={() => { setSelectDay(true); setSelectCourt(false); }}
              />
              <FilterChip
                label={matches.selectedCourt === "all" ? "Choose court" : matches.selectedCourt}
                active={matches.selectedCourt !== "all"}
                onClick={() => { setSelectCourt(true); setSelectDay(false); }}
              />
            </Box>
          )}

          {/* ── Day selector ── */}
          {selectDay && (
            <Box sx={{ mb: "10px" }}>
              <SelectorRow
                items={matches.dates}
                selected={matches.selectedDay}
                allLabel="All days"
                format={dateStringToString}
                onSelect={handleSelectDay}
              />
            </Box>
          )}

          {/* ── Court selector ── */}
          {selectCourt && (
            <Box sx={{ mb: "10px" }}>
              <SelectorRow
                items={matches.fields}
                selected={matches.selectedCourt}
                allLabel="All courts"
                onSelect={handleSelectCourt}
              />
            </Box>
          )}
        </>
      )}

      {/* ── Match list ── */}
      {matches.secret && renderMatches(matchesList, tournamentSlug, descending, matches.selectedDay, matches.selectedCourt, matches.secret)}
      {!matches.secret && !matches.showLoader && renderNoAccess()}
      {matches.showLoader && <Loader />}
    </Box>
  );
};

export default TournamentAdmin;