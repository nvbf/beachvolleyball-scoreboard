import React, { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "./../firebase/firebase-config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Dialog,
  Button,
} from "@mui/material";
import QRCode from "qrcode.react";
import { doc } from "firebase/firestore";

function TournamentAdmin() {
  const [matches, setMatches] = useState({ ongoing: [], finished: [] });
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState("");
  const [areFinishedMatchesExpanded, setAreFinishedMatchesExpanded] =
    useState(true);
  const [areOngoingMatchesExpanded, setAreOngoingMatchesExpanded] =
    useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const tournamentDoc = doc(
        db,
        "Tournaments",
        "hordaland_tour_04_-_u15u17u19__senior_23"
      );
      const matchesCollection = collection(tournamentDoc, "Matches");
      const matchesSnapshot = await getDocs(matchesCollection);

      const matchesData = [];

      matchesSnapshot.forEach((doc) => {
        matchesData.push(doc.data());
      });

      // Sort the matches by number
      matchesData.sort((a, b) => parseInt(a.Number) - parseInt(b.Number));

      // Split the matches into ongoing and finished based on HasWinner field
      const ongoingMatches = matchesData.filter((match) => !match.HasWinner);
      const finishedMatches = matchesData.filter((match) => match.HasWinner);

      // Update the matches state
      setMatches({ ongoing: ongoingMatches, finished: finishedMatches });
    };

    fetchMatches();
  }, []);

  const handleOpen = (url) => {
    setActiveQrCode(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleFinishedMatches = () => {
    setAreFinishedMatchesExpanded(!areFinishedMatchesExpanded);
  };

  const toggleOngoingMatches = () => {
    setAreOngoingMatchesExpanded(!areOngoingMatchesExpanded);
  };

  const renderMatches = (matchesArray: any[], showQrCode: any[]) =>
    matchesArray.map((match, index) => {
      const homeTeamName = match.HomeTeam?.Name;
      const awayTeamName = match.AwayTeam?.Name;

      // Don't render the match if both team names are empty strings
      if (!homeTeamName && !awayTeamName) {
        return null;
      }

      return (
        <Box mb={3} key={index}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Match {match.Number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>{match.Date}</TableCell>
                  {showQrCode && (
                    <TableCell rowSpan={3} align="right">
                      <Box display="flex" justifyContent="center" p={1}>
                        <QRCode
                          value={`Your QR Code Value Here`}
                          size={128}
                          onClick={() => handleOpen(`Your QR Code Value Here`)}
                        />
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell>Home Team</TableCell>
                  <TableCell>{homeTeamName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Away Team</TableCell>
                  <TableCell>{awayTeamName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Court</TableCell>
                  <TableCell>{match.Field?.Name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    });

  return (
    <div>
      <h2>
        Ongoing Matches{" "}
        <Button onClick={toggleOngoingMatches}>
          {areOngoingMatchesExpanded ? "Hide" : "Show"}
        </Button>
      </h2>
      {areOngoingMatchesExpanded && renderMatches(matches.ongoing, true)}

      <h2>
        Finished Matches{" "}
        <Button onClick={toggleFinishedMatches}>
          {areFinishedMatchesExpanded ? "Hide" : "Show"}
        </Button>
      </h2>
      {areFinishedMatchesExpanded && renderMatches(matches.finished, false)}

      <Dialog open={open} onClose={handleClose}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <QRCode value={activeQrCode} size={512} />
        </Box>
      </Dialog>
    </div>
  );
}

export default TournamentAdmin;
