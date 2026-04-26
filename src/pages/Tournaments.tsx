import React, { useEffect, useState } from 'react';
import { collection } from "@firebase/firestore";
import { db } from './../firebase/firebase-config';
import { Box, Typography } from '@mui/material';
import TournamentView from '../components/tournamentsOverview/tournamentView';
import { getDocs } from 'firebase/firestore';
import { isIncoming, isOngoing, isPast } from '../util/time';
import { colors } from '../theme';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface Tournament {
  endDate: string;
  startDate: string;
  name: string;
  slug: string;
  type: string;
  numberOfMatches: number | null;
  numberOfScoreboards: number | null;
}

const fetchTournaments = async (): Promise<Tournament[]> => {
  try {
    const tournamentCollection = collection(db, "Tournaments");
    const valueSnapshot = await getDocs(tournamentCollection);
    return valueSnapshot.docs.map((doc) => ({
      endDate: doc.data().EndDate,
      startDate: doc.data().StartDate,
      name: doc.data().Name,
      slug: doc.data().Slug,
      type: doc.data().Type,
      numberOfMatches: doc.data().NumberOfMatches,
      numberOfScoreboards: doc.data().NumberOfScoreboards,
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// ─── Section label ────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <Typography
    sx={{
      fontSize: "15px",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: colors.textFaint,
      mb: "12px",
      ml: "2px",
    }}
  >
    {label}
  </Typography>
);

// ─── Tournament card ──────────────────────────────────────────────────────────

type CardVariant = "active" | "upcoming" | "past";

interface TournamentCardProps {
  tournament: Tournament;
  variant: CardVariant;
  isInner?: boolean;
  isLast?: boolean;
}

const borderColors: Record<CardVariant, string> = {
  active: colors.ongoingBorder,
  upcoming: colors.upcomingBorder,
  past: colors.finishedBorder,
};

const metaBgColors: Record<CardVariant, string> = {
  active: colors.ongoingMetaBg,
  upcoming: colors.metaBg,
  past: colors.metaBg,
};

const cardBgColors: Record<CardVariant, string> = {
  active: colors.ongoingCardBg,
  upcoming: colors.cardBg,
  past: colors.cardBg,
};

const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const fmt = (d: Date) =>
    d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
  return start.toDateString() === end.toDateString()
    ? fmt(start)
    : `${fmt(start)} – ${fmt(end)}`;
};

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, variant, isInner, isLast }) => (
  <Box
    component="a"
    href={`/tournament/${tournament.slug}`}
    sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: cardBgColors[variant],
      border: isInner ? "none" : `1px solid ${colors.borderLight}`,
      borderBottom: isInner && !isLast ? `1px solid ${colors.borderMeta}` : isInner ? "none" : undefined,
      borderLeft: `4px solid ${borderColors[variant]}`,
      borderRadius: isInner ? 0 : "10px",
      mb: isInner ? 0 : "8px",
      overflow: "hidden",
      cursor: "pointer",
      textDecoration: "none",
      "&:hover": { opacity: 0.85 },
    }}
  >
    {/* Date */}
    <Box
      sx={{
        width: { xs: "120px", sm: "150px" },
        minWidth: { xs: "120px", sm: "150px" },
        px: "16px",
        py: "18px",
        fontSize: "15px",
        color: colors.textMuted,
        borderRight: `1px solid ${colors.borderMeta}`,
        backgroundColor: metaBgColors[variant],
        flexShrink: 0,
        lineHeight: 1.4,
      }}
    >
      {formatDateRange(tournament.startDate, tournament.endDate)}
    </Box>

    {/* Name */}
    <Box
      sx={{
        flex: 1,
        px: "20px",
        py: "18px",
        fontSize: "18px",
        fontWeight: 500,
        color: colors.textPrimary,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {tournament.name}
    </Box>

    {/* Match count */}
    <Box
      sx={{
        px: "20px",
        py: "18px",
        fontSize: "15px",
        color: colors.textFaint,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {tournament.numberOfMatches ?? 0} matches
    </Box>
  </Box>
);

// ─── Year accordion ───────────────────────────────────────────────────────────

interface YearAccordionProps {
  year: string;
  tournaments: Tournament[];
  defaultOpen?: boolean;
}

const YearAccordion: React.FC<YearAccordionProps> = ({ year, tournaments, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const totalMatches = tournaments.reduce((sum, t) => sum + (t.numberOfMatches ?? 0), 0);

  return (
    <Box sx={{ borderRadius: "8px", overflow: "hidden", mb: "6px" }}>
      {/* Header */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "18px",
          py: "14px",
          backgroundColor: colors.pageBg,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          borderBottom: open ? `1px solid ${colors.borderMeta}` : undefined,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, color: colors.textPrimary }}>
            {year}
          </Typography>
          <Typography sx={{ fontSize: "15px", color: colors.textFaint }}>
            — {tournaments.length} tournament{tournaments.length !== 1 ? "s" : ""} · {totalMatches} matches
          </Typography>
        </Box>
        {open
          ? <ExpandLess sx={{ fontSize: "24px", color: colors.textFaint }} />
          : <ExpandMore sx={{ fontSize: "24px", color: colors.textFaint }} />
        }
      </Box>

      {/* Body */}
      {open && (
        <Box
          sx={{
            border: `1px solid ${colors.borderLight}`,
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
          }}
        >
          {tournaments.map((t, i) => (
            <TournamentCard
              key={t.slug}
              tournament={t}
              variant="past"
              isInner
              isLast={i === tournaments.length - 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const Tournaments: React.FC = () => {
  const [data, setData] = useState<Tournament[] | null>(null);

  useEffect(() => {
    fetchTournaments().then(setData);
  }, []);

  if (data === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 4, color: colors.textMuted, fontSize: "13px" }}>
        Loading…
      </Box>
    );
  }

  const active = data.filter(t => isOngoing(t.startDate, t.endDate)).sort((a, b) => a.startDate < b.startDate ? 1 : -1);
  const upcoming = data.filter(t => isIncoming(t.startDate) && t.numberOfMatches).sort((a, b) => a.startDate < b.startDate ? 0 : 1);
  const past = data.filter(t => isPast(t.endDate)).sort((a, b) => b.startDate.localeCompare(a.startDate));

  const currentYear = new Date().getFullYear();

  const byYear = past.reduce((acc, t) => {
    const year = new Date(t.endDate).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(t);
    return acc;
  }, {} as Record<string, Tournament[]>);

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 6 }, pt: "28px", pb: 8 }}>

      {/* Active */}
      {active.length > 0 && (
        <Box sx={{ mb: "32px" }}>
          <SectionLabel label="Active" />
          {active.map(t => (
            <TournamentCard key={t.slug} tournament={t} variant="active" />
          ))}
        </Box>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Box sx={{ mb: "32px" }}>
          <SectionLabel label="Upcoming" />
          {upcoming.map(t => (
            <TournamentCard key={t.slug} tournament={t} variant="upcoming" />
          ))}
        </Box>
      )}

      {/* Previous */}
      {years.length > 0 && (
        <Box>
          <SectionLabel label="Previous" />
          {years.map(year => (
            <YearAccordion
              key={year}
              year={year}
              tournaments={byYear[year]}
              defaultOpen={Number(year) === currentYear}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Tournaments;