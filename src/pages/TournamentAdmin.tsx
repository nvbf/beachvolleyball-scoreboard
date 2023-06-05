import React, { useEffect, useState } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from './../firebase/firebase-config';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Dialog } from '@mui/material';
import QRCode from 'qrcode.react';
import { doc, getDoc } from 'firebase/firestore';

interface Match {
  homeTeam: {
    playersFullName: string[],
  },
  awayTeam: {
    playersFullName: string[],
  },
  epoch: number,
  court: string,
  matchId: string,
  group: string | null,
  result: string,
  isFinished: boolean,
  referee: string,
  stage: string,
  tournamentId: string,
}


function TournamentAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [qrSizes, setQrSizes] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      const tournamentDoc = doc(db, "Tournaments", "sandvesanden_open_23");
      const tournamentData = (await getDoc(tournamentDoc)).data();
      const tournamentId = tournamentData?.ID;
  
      const matchesCollection = collection(tournamentDoc, "Matches");
      const matchesSnapshot = await getDocs(matchesCollection);
  
      const matchesData: Match[] = [];
  
      matchesSnapshot.forEach((doc) => {
        matchesData.push({ ...doc.data(), tournamentId } as Match);
      });
  
      // Sort the matches by epoch timestamp
      matchesData.sort((a, b) => a.epoch - b.epoch);
  
      setMatches(matchesData);

      // Initialize qrSizes when matches are fetched
    const initialQrSizes = new Array(matchesData.length).fill(128);
    setQrSizes(initialQrSizes);
    };
  
    fetchMatches();
  }, []);

  const handleOpen = (url: string) => {
    setActiveQrCode(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {matches.map((match, index) => {
        const url = `https://scoreboard-sandbox.herokuapp.com/match?name1=${encodeURIComponent(match.homeTeam.playersFullName[0])}&name2=${encodeURIComponent(match.homeTeam.playersFullName[1])}&name3=${encodeURIComponent(match.awayTeam.playersFullName[0])}&name4=${encodeURIComponent(match.awayTeam.playersFullName[1])}&matchId=${match.matchId}&tournamentId=${match.tournamentId}`;
        <QRCode value={url} size={qrSizes[index]} onClick={() => handleOpen(url)} />
        console.log(url);
        return (
          <Box mb={3} key={index}>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Match {match.matchId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Home Team</TableCell>
                    <TableCell>{match.homeTeam.playersFullName.join(', ')}</TableCell>
                    <TableCell rowSpan={3} align="right">
                      <Box display="flex" justifyContent="center" p={1}>
                        <QRCode value={url} size={qrSizes[index]} onClick={() => handleOpen(url)} />
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Away Team</TableCell>
                    <TableCell>{match.awayTeam.playersFullName.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Court</TableCell>
                    <TableCell>{match.court}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <QRCode value={activeQrCode} size={512} />
        </Box>
      </Dialog>
    </div>
  );
}

export default TournamentAdmin;