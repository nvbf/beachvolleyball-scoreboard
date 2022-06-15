import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar"; import {
  Card,
  CardActions,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import { useAppSelector, useAppDispatch } from '../store/store'
import {
  VolleyCard, VolleyCardHeader, VolleyStack, LeftMarginBox,
  RightBox, VolleyAlert, VolleyRowStack, VolleyAvatar
} from "../util/styles"

export function Scoreboard() {
  const homeTeam = useAppSelector(state => state.team.homeTeam)
  const awayTeam = useAppSelector(state => state.team.awayTeam)
  const dispatch = useAppDispatch()

  const [homeTimeoutUsed, setHomeTimeoutUsed] = useState(false);
  const [awayTimeoutUsed, setAwayTimeoutUsed] = useState(false);

  function homeTeamTimeout() {
    setHomeTimeoutUsed(true);
  }

  function awayTeamTimeout() {
    setAwayTimeoutUsed(true);
  }

  return (
    <Box >
      <VolleyCard >
        <VolleyCardHeader
          title="Match standing"
        />
        <TableContainer component={Paper}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Teams</TableCell>
                <TableCell align="right">Set 1</TableCell>
                <TableCell align="right">Set 2</TableCell>
                <TableCell align="right">Set 3</TableCell>
                <TableCell align="right">Add Point</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <VolleyAvatar sx={{ bgcolor: homeTeam.shirtColor, height: 20, width: 20, borderColor: '#000' }} variant="rounded"> </VolleyAvatar><Box>{homeTeam.player1Name} - {homeTeam.player2Name}</Box>
                  </Stack>
                </TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right"><Button variant="contained" ><AddIcon /></Button></TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}              >
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <VolleyAvatar sx={{ bgcolor: awayTeam.shirtColor, height: 20, width: 20, borderColor: '#000' }} variant="rounded"> </VolleyAvatar><Box>{awayTeam.player1Name} - {awayTeam.player2Name}</Box>
                  </Stack>
                </TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right"><Button variant="contained" ><AddIcon /></Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <CardActions>
          {/* <Grid container> */}
          {/* <Stack sx={{ width: 1, paddingRight: 2 }}> */}
          <VolleyRowStack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            alignItems="center"
          >
          <Stack sx={{ width: 1, paddingRight: 2 }}>
          <Box sx={{ textTransform: 'uppercase', fontSize: 12 }}>timeouts: </Box>
            <Stack direction="row" spacing={1}>
              <Button disabled={homeTimeoutUsed} onClick={homeTeamTimeout} variant="contained" sx={{ textTransform: 'none' }}>
                <VolleyAvatar sx={{ bgcolor: homeTimeoutUsed ? '#fff': homeTeam.shirtColor, height: 20, width: 20 }} variant="rounded"> </VolleyAvatar>
                <LeftMarginBox> {homeTeam.player1Name} - {homeTeam.player2Name}</LeftMarginBox>
              </Button>
              <Button disabled={awayTimeoutUsed} onClick={awayTeamTimeout} variant="contained" sx={{ textTransform: 'none' }}>
                <VolleyAvatar sx={{ bgcolor: awayTimeoutUsed ? '#fff': awayTeam.shirtColor, height: 20, width: 20 }} variant="rounded"> </VolleyAvatar>
                <LeftMarginBox> {awayTeam.player1Name} - {awayTeam.player2Name}</LeftMarginBox>
              </Button>
            </Stack>
          </Stack>
            <Button sx={{ height: 36 }} color="warning" variant="contained">Undo</Button>
          </VolleyRowStack>
          {/* </Grid> */}
        </CardActions>
      </VolleyCard>

      <VolleyCard >
        <VolleyCardHeader
          subheader="Match standing"
        />
        <VolleyStack spacing={2}>

          <VolleyAlert severity="info">
            The first thing we need to do is to add the name of the players to the home team
          </VolleyAlert>
          <VolleyAlert severity="info">
            Pick a color for the team, or it will default to blue.
          </VolleyAlert>
        </VolleyStack>
      </VolleyCard>
    </Box >
  );
}

export default Scoreboard;
