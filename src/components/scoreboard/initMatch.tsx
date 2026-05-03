import { v4 } from "uuid";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useState } from 'react';
import { initMatch, resetTeamColor } from '../../store/match/reducer';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TeamType } from './../types';
import { getTextColorFromBackground } from "../../util/color";
import { getInitials } from "../../util/names";
import { colors } from "../../theme";

export function InitMatch() {
  const match = useAppSelector((state) => state.match);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  function setTeamColors(team: TeamType) {
    dispatch(resetTeamColor(team));
  }

  function handleDone() {
    dispatch(initMatch({
      id: v4(),
      awayColor: match.teamColor[TeamType.Away],
      homeColor: match.teamColor[TeamType.Home],
      awayTeam: { player1Name: match.awayTeam.player1Name, player2Name: match.awayTeam.player2Name },
      homeTeam: { player1Name: match.homeTeam.player1Name, player2Name: match.homeTeam.player2Name },
      matchId: match.matchId,
      tournamentId: match.tournamentId,
      timestamp: Date.now(),
    }));
    setLoading(true);
  }

  return (
    <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 4 }}>

      {/* Change team colors */}
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
        Change team colors:
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 5 }}>
        <TeamButton
          label={[
            getInitials(match.homeTeam.player1Name),
            getInitials(match.homeTeam.player2Name),
          ]}
          color={match.teamColor[TeamType.Home]}
          onClick={() => setTeamColors(TeamType.Home)}
        />
        <TeamButton
          label={[
            getInitials(match.awayTeam.player1Name),
            getInitials(match.awayTeam.player2Name),
          ]}
          color={match.teamColor[TeamType.Away]}
          onClick={() => setTeamColors(TeamType.Away)}
        />
      </Box>

      {/* When you are ready */}
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
        When you are ready:
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleDone}
          sx={{
            width: { xs: "100%", sm: "60%" },
            height: { xs: "72px", sm: "88px" },
            borderRadius: "10px",
          }}
        >
          {!loading ? (
            <Typography sx={{ fontSize: { xs: "22px", sm: "28px" }, fontWeight: 700 }}>
              Start match!
            </Typography>
          ) : (
            <CircularProgress color="inherit" />
          )}
        </Button>
      </Box>

    </Box>
  );
}

// ─── Team button ──────────────────────────────────────────────────────────────

const TeamButton: React.FC<{ label: string[]; color: string; onClick: () => void }> = ({ label, color, onClick }) => {
  const textColor = getTextColorFromBackground(color);
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        minHeight: { xs: "76px", sm: "92px" },
        backgroundColor: color,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "filter 0.12s",
        "&:hover": { filter: "brightness(1.08)" },
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
          }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

export default InitMatch;