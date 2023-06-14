import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatchesRequest } from "./../store/tournamentAdmin/action"; // update the path
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentAdmin/matchView";
import { Box, Button, Dialog, Grid } from "@mui/material";

const TournamentAdmin = () => {
  const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState("");

  const dispatch = useDispatch();

  const matches = useSelector((state: RootState) => state.matches.matches);
  const ongoingMatches = matches.filter((match) => !match.hasWinner);
  const finishedMatches = matches.filter((match) => match.hasWinner);

  useEffect(() => {
    dispatch(fetchMatchesRequest("osvb_test_2023")); // replace with actual tournamentSlug
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const renderMatches = (matches: any[], isOngoing: boolean) => {
    return (
      <Grid container>
        {matches.map((match, index) => (
         <Grid item key={index}> <MatchView match={match} /></Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box p={3}>
      <Box mt={3}>
        <h2>
          Ongoing Matches{" "}
          <Button variant="contained" onClick={() => setShowOngoing(!showOngoing)}>
            {showOngoing ? "Hide" : "Show"}
          </Button>
        </h2>
        {showOngoing && renderMatches(ongoingMatches, true)}
        <h2>
          Finished Matches{" "}
          <Button variant="contained" onClick={() => setShowFinished(!showFinished)}>
            {showFinished ? "Hide" : "Show"}
          </Button>
        </h2>
        {showFinished && renderMatches(finishedMatches, false)}
        <Dialog open={open} onClose={handleClose}>
          <Box p={3}>
            <QRCode
              value={activeQrCode}
              size={Math.min(512, window.outerWidth - 100)}
            />
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TournamentAdmin;
