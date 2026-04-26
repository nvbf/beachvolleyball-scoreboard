import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../store/store";
import MatchCard from "../components/tournamentView/MatchCard";
import { Box, Typography, Container } from "@mui/material";
import { ArrowBack, SwapVert } from '@mui/icons-material';
import { useParams, useNavigate } from "react-router-dom";
import { QueryFieldFilterConstraint, collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getMatchState, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { dateStringToString } from "../util/time";
import { chooseCourt, chooseDay, fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";
import { colors, statusColors } from "../theme";

// ─── Pill toggle ─────────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  count: number;
  active: boolean;
  statusKey: "ongoing" | "upcoming" | "finished";
  onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ label, count, active, statusKey, onClick }) => {
  const s = statusColors[statusKey];
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
        border: `1.5px solid ${active ? s.pillBorder : colors.inactivePillBorder}`,
        backgroundColor: active ? s.pillBg : colors.inactivePillBg,
        color: active ? s.pillText : colors.inactivePillText,
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
          backgroundColor: active ? s.dot : colors.inactiveCntBg,
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

// ─── Filter chip ─────────────────────────────────────────────────────────────

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

// ─── Selector row ─────────────────────────────────────────────────────────────

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

const TournamentView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  let tournamentSlug: string;
  switch (params.tournamentSlug) {
    case "jr-nm-1": tournamentSlug = "nmu15_-_nmu17_-_nmu19"; break;
    case "jr-nm-2": tournamentSlug = "nmu16_-_nmu18_-_nmu21"; break;
    default: tournamentSlug = params.tournamentSlug || "lofoten_open_23"; break;
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

  useEffect(() => {
    if (!tournamentSlug) return;
    const fetchName = async () => {
      const snap = await getDocs(collection(db, "Tournaments"));
      const match = snap.docs.find(d => d.data().Slug === tournamentSlug);
      if (match) setTournamentName(match.data().Name);
    };
    fetchName();
  }, [tournamentSlug]);

  const matches = useSelector((state: RootState) => state.matches);
  const matchesList: AdminMatch[] = Object.values(matches.matches);

  useEffect(() => {
    if (!fetchedMatches && tournamentSlug) {
      setFetchedMatches(true);
      dispatch(fetchMatchesRequest({ tournamentSlug, class: playerClass }));
    }
  });

  if (!createdCallbacks && tournamentSlug) {
    const currentDate = new Date().toISOString().split('T')[0];
    const collectionQuery: QueryFieldFilterConstraint[] = [];
    if (noDate === null) collectionQuery.push(where("Date", "==", currentDate));
    collectionQuery.push(where("HasWinner", "==", false));
    if (playerClass != null) collectionQuery.push(where("MatchCategory.CategoryCode", "==", playerClass));
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

  const upcomingCount = matchesList.filter(isUpcoming).length;
  const ongoingCount = matchesList.filter(isOngoing).length;
  const finishedCount = matchesList.filter(m => isFinished(m) || isReported(m)).length;

  const renderMatches = (
    matches: AdminMatch[],
    tournamentSlug: string,
    selectedDay: string,
    selectedCourt: string
  ) => {
    const filtered = matches
      .sort((a, b) => a.startTime - b.startTime)
      .filter(e =>
        (seeUpcoming && isUpcoming(e)) ||
        (seeOngoing && isOngoing(e)) ||
        (seeFinished && (isFinished(e) || isReported(e)))
      )
      .filter(e => selectedDay === "all" || new Date(e.startTime).toISOString().split('T')[0] === selectedDay)
      .filter(e => selectedCourt === "all" || e.arenaName === selectedCourt);

    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {filtered.map((match, index) => (
          <MatchCard key={`${match.matchId}-${index}`} match={match} tournamentSlug={tournamentSlug} />
        ))}
      </Box>
    );
  };

  const displayName = tournamentName ||
    tournamentSlug.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: colors.pageBg }}>

      {/* ── Header ── */}
      <Box
        sx={{
          backgroundColor: colors.pageBg,
          borderBottom: `1px solid ${colors.borderLight}`,
          px: { xs: 2, sm: 3 },
          py: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box
          onClick={() => navigate("/tournaments")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "6px",
            cursor: "pointer",
            color: colors.textMuted,
            "&:hover": { backgroundColor: colors.borderLight },
          }}
        >
          <ArrowBack sx={{ fontSize: "16px" }} />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "18px" },
            fontWeight: 600,
            color: colors.textPrimary,
            letterSpacing: "0.01em",
          }}
        >
          {displayName}
        </Typography>

        <Box
          component="img"
          src="/src/osvb_logo_hi_res.png"
          alt="OSVB"
          sx={{ height: "36px", width: "auto", objectFit: "contain", opacity: 0.7 }}
        />
      </Box>

      {/* ── Controls ── */}
      <Container maxWidth="lg" sx={{ pt: "10px", pb: "4px" }}>

        {/* Status pills */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", mb: "8px", alignItems: "center" }}>
          <Pill label="Upcoming" count={upcomingCount} active={seeUpcoming} statusKey="upcoming" onClick={() => setSeeUpcoming(!seeUpcoming)} />
          <Pill label="Ongoing" count={ongoingCount} active={seeOngoing} statusKey="ongoing" onClick={() => setSeeOngoing(!seeOngoing)} />
          <Pill label="Finished" count={finishedCount} active={seeFinished} statusKey="finished" onClick={() => setSeeFinished(!seeFinished)} />
        </Box>

        {/* Day / court filters */}
        {!selectDay && !selectCourt && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: "6px", mb: "8px" }}>
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

        {/* Day selector */}
        {selectDay && (
          <Box sx={{ mb: "8px" }}>
            <SelectorRow
              items={matches.dates}
              selected={matches.selectedDay}
              allLabel="All days"
              format={dateStringToString}
              onSelect={handleSelectDay}
            />
          </Box>
        )}

        {/* Court selector */}
        {selectCourt && (
          <Box sx={{ mb: "8px" }}>
            <SelectorRow
              items={matches.fields}
              selected={matches.selectedCourt}
              allLabel="All courts"
              onSelect={handleSelectCourt}
            />
          </Box>
        )}
      </Container>

      {/* ── Match list ── */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {renderMatches(matchesList, tournamentSlug, matches.selectedDay, matches.selectedCourt)}
      </Container>
    </Box>
  );
};

export default TournamentView;