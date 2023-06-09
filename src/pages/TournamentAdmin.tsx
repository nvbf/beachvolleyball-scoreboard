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
} from "@mui/material";
import QRCode from "qrcode.react";

function TournamentAdmin() {
const [matches, setMatches] = useState<{ ongoing: any[]; finished: any[] }>({ ongoing: [], finished: [] });
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState("");
  const [showOngoing, setShowOngoing] = useState(true);
  const [showFinished, setShowFinished] = useState(true);
  const [tournamentID, setTournamentID] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      const tournamentDocRef = doc(
        db,
        "Tournaments",
        "hordaland_tour_04_-_u15u17u19__senior_23"
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
        const matchID = match.ID;
        const awayTeamName = match.AwayTeam?.Name?.replace(/^\#\d+\s/, "");
        const homeTeamName = match.HomeTeam?.Name?.replace(/^\#\d+\s/, "");


        const [name1, name2] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
const [name3, name4] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];

      const url = showQRCode
        ? `https://scoreboard-sandbox.herokuapp.com/match?name1=${encodeURIComponent(
            name1
          )}&name2=${encodeURIComponent(name2)}&name3=${encodeURIComponent(
            name3
          )}&name4=${encodeURIComponent(
            name4
          )}&matchid=${matchID}&tournamentid=${tournamentID}`
        : "";


      return (
        <Box mb={3} key={match.Number}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Match {match.Number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>{match.Date}</TableCell>
                  {showQRCode && (
                    <TableCell rowSpan={4} align="right">
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
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell>Away team</TableCell>
                  <TableCell>{awayTeamName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Home team</TableCell>
                  <TableCell>{homeTeamName}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
        {renderMatches(matches.ongoing, true,tournamentID)}
      </Collapse>
      <h2>
        Finished Matches{" "}
        <button onClick={() => setShowFinished(!showFinished)}>
          {showFinished ? "Hide" : "Show"}
        </button>
      </h2>
      <Collapse in={showFinished}>
        {renderMatches(matches.finished, false,tournamentID)}
      </Collapse>
      <Dialog open={open} onClose={handleClose}>
        <Box p={3}>
          <QRCode value={activeQrCode} size={256} />
        </Box>
      </Dialog>
    </Box>
  );
}

export default TournamentAdmin;
