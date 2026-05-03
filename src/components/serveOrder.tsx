import {
  Box,
  Typography,
} from "@mui/material";
import React from 'react';
import { addEvent } from '../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../store/store';
import { TeamType, Event, EventType } from './types';
import Grid from "@mui/material/Grid"
import { getInitials } from "../util/names";
import { selectFirstServerEvent, selectFirstServingTeamEvent } from "./eventFunctions";
import { matchState } from "../store/types";
import { getTextColorFromBackground } from "../util/color";
import { colors } from "../theme";

export function ServeOrder() {
  const match = useAppSelector((state) => state.match);
  const dispatch = useAppDispatch();

  function setFirstServerTeam(team: TeamType) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: selectFirstServingTeamEvent(team, match.authUserId) }));
  }

  function setHomeServer(player: number) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: selectFirstServerEvent(TeamType.Home, player, match.authUserId) }));
  }

  function setAwayServer(player: number) {
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: selectFirstServerEvent(TeamType.Away, player, match.authUserId) }));
  }

  return (
    <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

      {/* ── Section: First team to serve ── */}
      <Section label="First team to serve">
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1, display: showServer(match, TeamType.Home, 0) }}>
            <TeamButton
              label={[
                getInitials(match.homeTeam.player1Name),
                getInitials(match.homeTeam.player2Name),
              ]}
              color={match.teamColor[TeamType.Home]}
              disabled={match.firstServerTeam !== TeamType.None}
              onClick={() => setFirstServerTeam(TeamType.Home)}
            />
          </Box>
          <Box sx={{ flex: 1, display: showServer(match, TeamType.Away, 0) }}>
            <TeamButton
              label={[
                getInitials(match.awayTeam.player1Name),
                getInitials(match.awayTeam.player2Name),
              ]}
              color={match.teamColor[TeamType.Away]}
              disabled={match.firstServerTeam !== TeamType.None}
              onClick={() => setFirstServerTeam(TeamType.Away)}
            />
          </Box>
        </Box>
      </Section>

      {/* ── Section: First home team server ── */}
      <Section label="First home team server">
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1, display: showServer(match, TeamType.Home, 1) }}>
            <TeamButton
              label={[getInitials(match.homeTeam.player1Name)]}
              color={match.teamColor[TeamType.Home]}
              disabled={match.firstServer[TeamType.Home] !== 0}
              onClick={() => setHomeServer(1)}
            />
          </Box>
          <Box sx={{ flex: 1, display: showServer(match, TeamType.Home, 2) }}>
            <TeamButton
              label={[getInitials(match.homeTeam.player2Name)]}
              color={match.teamColor[TeamType.Home]}
              disabled={match.firstServer[TeamType.Home] !== 0}
              onClick={() => setHomeServer(2)}
            />
          </Box>
        </Box>
      </Section>

      {/* ── Section: First away team server ── */}
      <Section label="First away team server">
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1, display: showServer(match, TeamType.Away, 1) }}>
            <TeamButton
              label={[getInitials(match.awayTeam.player1Name)]}
              color={match.teamColor[TeamType.Away]}
              disabled={match.firstServer[TeamType.Away] !== 0}
              onClick={() => setAwayServer(1)}
            />
          </Box>
          <Box sx={{ flex: 1, display: showServer(match, TeamType.Away, 2) }}>
            <TeamButton
              label={[getInitials(match.awayTeam.player2Name)]}
              color={match.teamColor[TeamType.Away]}
              disabled={match.firstServer[TeamType.Away] !== 0}
              onClick={() => setAwayServer(2)}
            />
          </Box>
        </Box>
      </Section>

    </Box>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography
      sx={{
        fontSize: { xs: "18px", sm: "22px" },
        fontWeight: 500,
        color: colors.textMuted,
        textAlign: "center",
        mb: 2,
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

// ─── Team button ──────────────────────────────────────────────────────────────

interface TeamButtonProps {
  label: string[];
  color: string;
  disabled: boolean;
  onClick: () => void;
}

const TeamButton: React.FC<TeamButtonProps> = ({ label, color, disabled, onClick }) => {
  const textColor = getTextColorFromBackground(color);

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: "100%",
        minHeight: { xs: "76px", sm: "88px" },
        backgroundColor: color,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.12s, filter 0.12s",
        boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
        "&:hover": disabled ? {} : {
          filter: "brightness(1.08)",
        },
        px: 2,
      }}
    >
      {label.map((line, i) => (
        <Typography
          key={i}
          sx={{
            fontSize: { xs: "16px", sm: "20px" },
            fontWeight: 700,
            color: textColor,
            letterSpacing: "0.04em",
            lineHeight: 1.2,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

export default ServeOrder;

// ─── Helpers (unchanged) ──────────────────────────────────────────────────────

export const getServer = (events: Event[], team: TeamType): number => {
  let servingPlayer = 0;
  let servingTeam = TeamType.Home;
  let lastServingTeam: TeamType;
  let lastServingPlayer: Number;

  events.forEach((event) => {
    if (!event.undone) {
      switch (event.eventType) {
        case EventType.Score:
          if (lastServingTeam !== event.team) {
            servingTeam = event.team;
            if (servingTeam !== team) break;
            if (lastServingPlayer === 1) {
              servingPlayer = 2;
            } else {
              servingPlayer = 1;
            }
          }
          break;
        case EventType.FirstPlayerServer:
          if (event.team === team) servingPlayer = event.playerId;
          break;
        case EventType.FirstTeamServer:
          servingTeam = event.team;
          break;
      }
      lastServingTeam = servingTeam;
      lastServingPlayer = servingPlayer;
    }
  });

  return servingTeam === team ? servingPlayer : 0;
};

export function showServer(matchState: matchState, team: TeamType, playerId: number): string | undefined {
  if (playerId === 0) {
    return matchState.firstServerTeam === TeamType.None || matchState.firstServerTeam === team ? 'flex' : 'none';
  } else if (team === TeamType.Home) {
    return matchState.firstServer[TeamType.Home] === 0 || matchState.firstServer[TeamType.Home] === playerId ? 'flex' : 'none';
  } else {
    return matchState.firstServer[TeamType.Away] === 0 || matchState.firstServer[TeamType.Away] === playerId ? 'flex' : 'none';
  }
}