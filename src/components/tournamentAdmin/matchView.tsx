import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ChromePicker } from "react-color";
import {
    Abc,
} from '@mui/icons-material';
import { getTextColorFromBackground } from "../../util/color";
import { addEvent, setTeamColor } from "../../store/match/actions";
import { getInitials } from "../../util/names";
import { Match } from "./types";
import QRCode from "qrcode.react";


interface MatchViewProps {
    match: Match;
}

export function MatchView({ match }: MatchViewProps) {
    const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState("");
    const handleClose = () => {
        setOpen(false);
      };

      const awayTeamName = match.awayTeam?.name?.replace(/^\#\d+\s/, "");
      const homeTeamName = match.homeTeam?.name?.replace(/^\#\d+\s/, "");
      const [name1, name2] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
      const [name3, name4] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];
      
    return (
        <Box mb={3} key={match.scoreboardID} sx={{
            border: 2, borderRadius: '12px', borderColor: 'black'
        }} >
            <Grid container
                spacing={2}
                columns={12}
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Grid item md={10} xs={8} sx={{ textAlign: 'right' }}>
                    <Grid container
                        spacing={2}
                        justifyContent="flex-end"
                        alignItems="center"
                        columns={12}
                    >
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {match.arenaName}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                Match: {match.matchCategory}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {match.date}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {match.date}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {getInitials(name1)} / {getInitials(name2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                {getInitials(name3)} / {getInitials(name4)}
                            </Typography>
                        </Grid>

                        {(match.scoreboardID && match.currentScore) && <Grid item xs={12}>
                            <Typography align='left' sx={{
                                variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                            }}>
                                <span key={"set"}>
                                    <b>{match.currentSetScore.home}-{match.currentSetScore.away}{' '}</b>
                                </span>
                                
                            </Typography>
                        </Grid>}
                    </Grid>
                </Grid>
                <Grid item md={2} xs={4} sx={{ textAlign: 'right' }}>
                    <Box display="flex" justifyContent="center" p={1}>
                        "QR kode"
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => console.log("knapp")}
                        >
                            Expand QR
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};


export default MatchView;