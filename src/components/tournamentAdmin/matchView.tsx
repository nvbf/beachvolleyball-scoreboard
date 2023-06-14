import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";

import { getInitials } from "../../util/names";
import { Match } from "./types";

interface MatchViewProps {
  match: Match;
  tournamentSlug:string
}

export function MatchView({ match, tournamentSlug }: MatchViewProps) {
  const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (url: React.SetStateAction<string>) => {
    setActiveQrCode(url);
    setOpen(true);
  };

  const awayTeamName = match.awayTeam?.name?.replace(/^\#\d+\s/, "");
  const homeTeamName = match.homeTeam?.name?.replace(/^\#\d+\s/, "");
  const [name1, name2] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
  const [name3, name4] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];

  const url = `https://${
    window.location.hostname
  }/match?name1=${encodeURIComponent(name1.trim())}&name2=${encodeURIComponent(
    name2.trim()
  )}&name3=${encodeURIComponent(name3.trim())}&name4=${encodeURIComponent(
    name4.trim()
  )}&matchId=${match.scoreboardID}&tournamentId=${tournamentSlug}`;
  ("");

  return (
    <Box
      mb={3}
      key={match.scoreboardID}
      sx={{
        border: 2,
        borderRadius: "12px",
        borderColor: "black",
      }}
    >
      <Grid
        container
        spacing={2}
        columns={12}
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item md={10} xs={8} sx={{ textAlign: "right" }}>
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            alignItems="center"
            columns={12}
          >
            <Grid item xs={6}>
              <Typography
                align="left"
                sx={{
                  variant: "button",
                  lineHeight: 1,
                  paddingTop: 1,
                  paddingX: 1,
                }}
              >
                {match.arenaName}
              </Typography>
              
            </Grid>
            <Grid item xs={6}>
              <Typography
                align="left"
                sx={{
                  variant: "button",
                  lineHeight: 1,
                  paddingTop: 1,
                  paddingX: 1,
                }}
              >
                               {(match.scoreboardID && match.currentScore) && <Grid item xs={12}>
                  <Typography align='left' sx={{
                    variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                  }}>
                    <span key={"set"}>
                      <b>{match.currentSetScore["HOME"]}-{match.currentSetScore["AWAY"]}{' '}</b>
                    </span>
                    {match.currentScore.map((score: {[key: string]: number}, index: number) => (
                      <span key={index}>
                        ({score.HOME}-{score.AWAY}){' '}
                      </span>
                    ))}
                  </Typography>
                </Grid>}              </Typography>
              </Grid>
            <Grid item xs={6}>
              <Typography
                align="left"
                sx={{
                  variant: "button",
                  lineHeight: 1,
                  paddingTop: 1,
                  paddingX: 1,
                }}
              >
                Match: {match.matchCategory}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                align="left"
                sx={{
                  variant: "button",
                  lineHeight: 1,
                  paddingTop: 1,
                  paddingX: 1,
                }}
              >
                {match.date}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                align="left"
                sx={{
                  variant: "button",
                  lineHeight: 1,
                  paddingTop: 1,
                  paddingX: 1,
                }}
              >
                {getInitials(name1)} / {getInitials(name2)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                align="left"
                sx={{
                  variant: "button",
                  lineHeight: 1,
                  paddingTop: 1,
                  paddingX: 1,
                }}
              >
                {getInitials(name3)} / {getInitials(name4)}
              </Typography>
            </Grid>

          </Grid>
        </Grid>
        <Grid item md={2} xs={4} sx={{ textAlign: "right" }}>
          <Box display="flex" justifyContent="center" p={1}>
            "QR kode"
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleOpen(url)}
            >
              Expand QR
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MatchView;
