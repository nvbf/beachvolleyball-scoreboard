import AddIcon from '@mui/icons-material/Add';
import { default as ArrowDropDownIcon, default as ArrowDropUpIcon } from '@mui/icons-material/ArrowDropDown';
import {
  CardActions,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import { addPoint, scorePoint, callTimeout, startStopwatch } from '../store/match/actions';
import { useAppDispatch, useAppSelector } from '../store/store';
import { LeftMarginBox, VolleyAlert, VolleyAvatar, VolleyCard, VolleyCardHeader, VolleyRowStack, VolleyStack } from "../util/styles";
import { Actor } from './types';




interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function Scoreboard() {
  const match = useAppSelector(state => state.match)

  const dispatch = useAppDispatch()
  const [infoCollapse, setInfoCollapse] = useState(false);


  function homePoint() {
    dispatch(scorePoint(Actor.HomeTeam))
  }

  function awayPoint() {
    dispatch(scorePoint(Actor.AwayTeam))
  }

  function homeTeamTimeout() {
    dispatch(callTimeout(Actor.HomeTeam))
    dispatch(startStopwatch())
  }

  function awayTeamTimeout() {
    dispatch(callTimeout(Actor.AwayTeam))
    dispatch(startStopwatch())
  }

  function toggleInfo() {
    setInfoCollapse(!infoCollapse);
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
                    <VolleyAvatar sx={{ bgcolor: match.homeTeam.shirtColor, height: 20, width: 20, borderColor: '#000' }} variant="rounded"> </VolleyAvatar>
                    <Box>{match.homeTeam.player1Name} - {match.homeTeam.player2Name}</Box>
                  </Stack>
                </TableCell>
                <TableCell align="right">{match.sets[0].homeTeamScore}</TableCell>
                <TableCell align="right">{match.sets[1].homeTeamScore}</TableCell>
                <TableCell align="right">{match.sets[2].homeTeamScore}</TableCell>
                <TableCell align="right"><Button variant="contained" onClick={homePoint}><AddIcon /></Button></TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <VolleyAvatar sx={{ bgcolor: match.awayTeam.shirtColor, height: 20, width: 20, borderColor: '#000' }} variant="rounded"> </VolleyAvatar>
                    <Box>{match.awayTeam.player1Name} - {match.awayTeam.player2Name}</Box>
                  </Stack>
                </TableCell>
                <TableCell align="right">{match.sets[0].awayTeamScore}</TableCell>
                <TableCell align="right">{match.sets[1].awayTeamScore}</TableCell>
                <TableCell align="right">{match.sets[2].awayTeamScore}</TableCell>
                <TableCell align="right"><Button variant="contained" onClick={awayPoint} ><AddIcon /></Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <CardActions>
          <VolleyRowStack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            alignItems="center"
          >
            <Stack sx={{ width: 1, paddingRight: 2 }}>
              <Box sx={{ textTransform: 'uppercase', fontSize: 12 }}>timeouts: </Box>
              <Stack direction="row" spacing={1}>
                <Button disabled={match.homeTimeout} onClick={homeTeamTimeout} variant="contained" sx={{ textTransform: 'none' }}>
                  <VolleyAvatar sx={{ bgcolor: match.awayTimeout ? '#fff' : match.homeTeam.shirtColor, height: 20, width: 20 }} variant="rounded"> </VolleyAvatar>
                  <LeftMarginBox> {match.homeTeam.player1Name} - {match.homeTeam.player2Name}</LeftMarginBox>
                </Button>
                <Button disabled={match.awayTimeout} onClick={awayTeamTimeout} variant="contained" sx={{ textTransform: 'none' }}>
                  <VolleyAvatar sx={{ bgcolor: match.awayTimeout ? '#fff' : match.awayTeam.shirtColor, height: 20, width: 20 }} variant="rounded"> </VolleyAvatar>
                  <LeftMarginBox> {match.awayTeam.player1Name} - {match.awayTeam.player2Name}</LeftMarginBox>
                </Button>
              </Stack>
            </Stack>
            <Button sx={{ height: 36 }} color="warning" variant="contained">Undo</Button>
          </VolleyRowStack>
        </CardActions>
      </VolleyCard>

      <VolleyCard >
        <VolleyRowStack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          alignItems="center"
        >
          <Typography sx={{ paddingLeft: 2 }}>Match events</Typography>
          <Box sx={{ paddingRight: 2 }} >
            <ExpandMore
              expand={infoCollapse}
              onClick={toggleInfo}
              aria-expanded={infoCollapse}
              aria-label="show more"
            >
              {infoCollapse && <ArrowDropDownIcon sx={{ width: 60 }} />}
              {!infoCollapse && <ArrowDropUpIcon sx={{ width: 60 }} />}
            </ExpandMore>
          </Box>
        </VolleyRowStack>
        <Collapse in={infoCollapse} timeout="auto" unmountOnExit>
          <VolleyStack spacing={2}>
            <VolleyAlert severity="info">
              This scoreboard should be so easy to use and help you in all the parts of the scoreboard process so that it's no need for more people then the referee
            </VolleyAlert>
            <VolleyAlert severity="info">
              You can set the service order by clicking the "Set service order" button above. (Optional) When you have set the service order, we will help you keep track of how is serving.
            </VolleyAlert>
          </VolleyStack>
        </Collapse>
      </VolleyCard>

      <VolleyCard >
        <VolleyRowStack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          alignItems="center"
        >
          <Typography sx={{ paddingLeft: 2 }}>Settings</Typography>
          <Box sx={{ paddingRight: 2 }} >
            <ExpandMore
              expand={infoCollapse}
              onClick={toggleInfo}
              aria-expanded={infoCollapse}
              aria-label="show more"
            >
              {infoCollapse && <ArrowDropDownIcon sx={{ width: 60 }} />}
              {!infoCollapse && <ArrowDropUpIcon sx={{ width: 60 }} />}
            </ExpandMore>
          </Box>
        </VolleyRowStack>
        <Collapse in={infoCollapse} timeout="auto" unmountOnExit>
          <VolleyStack spacing={2}>
            <VolleyAlert severity="info">
              This scoreboard should be so easy to use and help you in all the parts of the scoreboard process so that it's no need for more people then the referee
            </VolleyAlert>
            <VolleyAlert severity="info">
              You can set the service order by clicking the "Set service order" button above. (Optional) When you have set the service order, we will help you keep track of how is serving.
            </VolleyAlert>
          </VolleyStack>
        </Collapse>
      </VolleyCard>

      <VolleyCard >
        <VolleyRowStack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          alignItems="center"
        >
          <Typography sx={{ paddingLeft: 2 }}>Notes for first time users</Typography>
          <Box sx={{ paddingRight: 2 }} >
            <ExpandMore
              expand={infoCollapse}
              onClick={toggleInfo}
              aria-expanded={infoCollapse}
              aria-label="show more"
            >
              {infoCollapse && <ArrowDropDownIcon sx={{ width: 60 }} />}
              {!infoCollapse && <ArrowDropUpIcon sx={{ width: 60 }} />}
            </ExpandMore>
          </Box>
        </VolleyRowStack>
        <Collapse in={infoCollapse} timeout="auto" unmountOnExit>
          <VolleyStack spacing={2}>
            <VolleyAlert severity="info">
              This scoreboard should be so easy to use and help you in all the parts of the scoreboard process so that it's no need for more people then the referee
            </VolleyAlert>
            <VolleyAlert severity="info">
              You can set the service order by clicking the "Set service order" button above. (Optional) When you have set the service order, we will help you keep track of how is serving.
            </VolleyAlert>
          </VolleyStack>
        </Collapse>
      </VolleyCard>
    </Box >
  );
}

export default Scoreboard;
