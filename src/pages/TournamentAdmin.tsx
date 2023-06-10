import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, DocumentData } from "@firebase/firestore";
import { db } from "./../firebase/firebase-config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  Collapse,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import QRCode from "qrcode.react";
import { useParams } from "react-router-dom";
import { getInitials } from "../util/names";

function TournamentAdmin() {
  const params = useParams();

  const [matches, setMatches] = useState<{ ongoing: any[]; finished: any[] }>({ ongoing: [], finished: [] });
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState("");
  const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);
  const [tournamentID, setTournamentID] = useState("");
  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : "dummy"

  useEffect(() => {
    const fetchMatches = async () => {
      const tournamentDocRef = doc(
        db,
        "Tournaments",
        tournamentSlug
      );

      // Fetch tournament document to get tournamentID
      const tournamentDoc = await getDoc(tournamentDocRef);
      const tournamentID = tournamentDoc.data()?.ID;
      setTournamentID(tournamentID);

      const matchesCollection = collection(tournamentDocRef, "Matches");
      const matchesSnapshot = await getDocs(matchesCollection);

      const matchesData: DocumentData[] = [];

      matchesSnapshot.forEach((doc) => {
        matchesData.push(doc.data());
      });

      matchesData.sort((a, b) => parseInt(a.Number) - parseInt(b.Number));

      const ongoingMatches = matchesData.filter((match) => !match.HasWinner);
      const finishedMatches = matchesData.filter((match) => match.HasWinner);

      setMatches({ ongoing: ongoingMatches, finished: finishedMatches });

      renderMatches(ongoingMatches, true, tournamentID);
      renderMatches(finishedMatches, false, tournamentID);
    };

    fetchMatches();
  }, []);

  const handleOpen = (url: React.SetStateAction<string>) => {
    setActiveQrCode(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderMatches = (matchesArray: any[], showQRCode: boolean, tournamentID: string) =>
    matchesArray.map((match) => {
      const matchID = match.Number;
      const awayTeamName = match.AwayTeam?.Name?.replace(/^\#\d+\s/, "");
      const homeTeamName = match.HomeTeam?.Name?.replace(/^\#\d+\s/, "");


      const [name1, name2] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
      const [name3, name4] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];

      const url = showQRCode
        ? `https://${window.location.hostname}/match?name1=${encodeURIComponent(
          name1.trim()
        )}&name2=${encodeURIComponent(name2.trim())}&name3=${encodeURIComponent(
          name3.trim()
        )}&name4=${encodeURIComponent(
          name4.trim()
        )}&matchid=${matchID}&tournamentid=${tournamentSlug}`
        : "";

      return (
        <Box mb={3} key={match.Number} sx={{
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
                  {match.Field.Name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='left' sx={{
                    variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                  }}>
                    Match: {match.Number}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='left' sx={{
                    variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                  }}>
                  {match.Time}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='left' sx={{
                    variant: 'button', lineHeight: 1, paddingTop: 1, paddingX: 1
                  }}>
                    {match.Date}
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
              </Grid>
            </Grid>
            <Grid item md={2} xs={4} sx={{ textAlign: 'right' }}>
              <Box display="flex" justifyContent="center" p={1}>
                <QRCode value={url} />
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
    });

  return (
    <Box mt={3}>
      <h2>
        Ongoing Matches{" "}
        <button onClick={() => setShowOngoing(!showOngoing)}>
          {showOngoing ? "Hide" : "Show"}
        </button>
      </h2>
      <Collapse in={showOngoing}>
        {renderMatches(matches.ongoing, true, tournamentID)}
      </Collapse>
      <h2>
        Finished Matches{" "}
        <button onClick={() => setShowFinished(!showFinished)}>
          {showFinished ? "Hide" : "Show"}
        </button>
      </h2>
      <Collapse in={showFinished}>
        {renderMatches(matches.finished, false, tournamentID)}
      </Collapse>
      <Dialog open={open} onClose={handleClose}>
        <Box p={3}>
          <QRCode value={activeQrCode} size={Math.min( 512, window.outerWidth - 100)} />
        </Box>
      </Dialog>
    </Box>
  );
}

export default TournamentAdmin;
