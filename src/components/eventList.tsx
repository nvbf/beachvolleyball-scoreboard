import React, { useState } from "react";
import { Event, EventType, TeamType } from "./types";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/store";
import { addEvent } from "../store/match/reducer";
import { createCommentEvent } from "./eventFunctions";
import moment from "moment";

const REMARK_MAX_LENGTH = 200;

const EventList: React.FC = () => {
  const match = useAppSelector((state) => state.match);
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isRemarkDialogOpen, setIsRemarkDialogOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  const toggleExpansion = () => {
    setIsExpanded((expanded) => !expanded);
  };

  const openRemarkDialog = () => {
    setCommentText("");
    setIsRemarkDialogOpen(true);
  };

  const closeRemarkDialog = () => {
    setIsRemarkDialogOpen(false);
    setCommentText("");
  };

  const submitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) {
      return;
    }
    dispatch(addEvent({ matchId: match.matchId, id: match.id, event: createCommentEvent(trimmed, match.authUserId) }));
    setIsRemarkDialogOpen(false);
    setCommentText("");
  };

  const formatElapsed = (milliseconds: number): string => {
    const elapsed = moment.duration(milliseconds);
    const hours = Math.floor(elapsed.asHours()).toString().padStart(2, "0");
    const minutes = elapsed.minutes().toString().padStart(2, "0");
    const seconds = elapsed.seconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const eventTypeToString = (eventType: EventType): string => {
    switch (eventType) {
      case EventType.Score:
        return "Score";
      case EventType.Timeout:
        return "Timeout";
      case EventType.Undo:
        return "Undo";
      case EventType.FirstPlayerServer:
        return "First Player Serve";
      case EventType.FirstTeamServer:
        return "First Team Serve";
      case EventType.ConfigureTeam:
        return "Configure Team";
      case EventType.PickColor:
        return "Configure Team Color";
      default:
        return "";
    }
  };

  const teamToString = (team: TeamType): string => {
    switch (team) {
      case TeamType.Home:
        return "Home";
      case TeamType.Away:
        return "Away";
      default:
        return "";
    }
  };

  const timelineEvents = [...match.events]
    .filter((event) => !event.undone && (event.eventType === EventType.Score || event.eventType === EventType.Timeout || event.eventType === EventType.Comment))
    .sort((a, b) => a.timestamp - b.timestamp);

  const startTimestamp = timelineEvents.length > 0 ? timelineEvents[0].timestamp : 0;
  let homeSetScore = [0, 0, 0];
  let awaySetScore = [0, 0, 0];
  let currentSet = 1;

  const timelineRows = timelineEvents.map((event) => {
    let displayHome = homeSetScore[currentSet - 1];
    let displayAway = awaySetScore[currentSet - 1];

    if (event.eventType === EventType.Score) {
      const setIndex = currentSet - 1;
      if (event.team === TeamType.Home) {
        homeSetScore[setIndex] += 1;
      } else if (event.team === TeamType.Away) {
        awaySetScore[setIndex] += 1;
      }

      // The score shown for this row should represent the scoreboard exactly at this event.
      displayHome = homeSetScore[setIndex];
      displayAway = awaySetScore[setIndex];

      // Keep event-list standing aligned with reducer rules for set progression.
      if (currentSet === 1 || currentSet === 2) {
        if (homeSetScore[setIndex] >= 21 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
          currentSet += 1;
        }
      } else {
        if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
        } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
          homeSetScore[setIndex] = 0;
          awaySetScore[setIndex] = 0;
        }
      }
    }

    const localTime = moment(event.timestamp).format("HH.mm:ss");
    const elapsed = formatElapsed(event.timestamp - startTimestamp);
    const eventName = event.eventType === EventType.Comment
      ? event.reference
      : `${eventTypeToString(event.eventType)}${event.team === TeamType.None ? "" : ` ${teamToString(event.team)}`}`;
    const standing = `${displayHome}-${displayAway}`;

    return {
      id: event.id,
      localTime,
      elapsed,
      eventName,
      standing,
    };
  });

  const reversedRows = [...timelineRows].reverse();
  const displayedRows = isExpanded ? reversedRows : reversedRows.slice(0, 3);

  return (
    <Grid sx={{ alignSelf: 'center', textAlign: 'center' }} marginTop={2}>
      <Box className="match-event-log" sx={{ width: 'fit-content', maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        <TableContainer sx={{ width: 'fit-content', maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto', overflowX: 'auto' }}>
          <Table size="small" sx={{ width: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", color: "rgba(28,28,30,0.65)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Local</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", color: "rgba(28,28,30,0.65)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Since Start</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", color: "rgba(28,28,30,0.65)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Event</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "right", whiteSpace: "nowrap", color: "rgba(28,28,30,0.65)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Standing</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ borderBottom: "none", paddingY: 1.1 }}>
                  <Typography variant="body2" sx={{ whiteSpace: "nowrap", color: "rgba(28,28,30,0.75)" }}>{row.localTime}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "none", paddingY: 1.1 }}>
                  <Typography variant="body2" sx={{ whiteSpace: "nowrap", color: "rgba(28,28,30,0.75)" }}>{row.elapsed}</Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "none", paddingY: 1.1 }}>
                  <Typography variant="body2" sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>{row.eventName}</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "right", borderBottom: "none", paddingY: 1.1 }}>
                  <Typography variant="body2" sx={{ whiteSpace: "nowrap", fontWeight: 700 }}>{row.standing}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1, paddingTop: 1, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <Button
          size="small"
          onClick={openRemarkDialog}
          sx={{ color: "rgba(28,28,30,0.65)", fontWeight: 700 }}
        >
          Add Remark
        </Button>
      </Box>
      </Box>
      {timelineRows.length > 3 && (
        <Button variant="contained" onClick={toggleExpansion} sx={{ marginTop: 1.5, borderRadius: '10px', fontWeight: 700, minWidth: 132, backgroundColor: '#1a6bba', '&:hover': { backgroundColor: '#15599d' } }}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}

      <Dialog open={isRemarkDialogOpen} onClose={closeRemarkDialog} fullWidth maxWidth="xs">
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            placeholder="Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, REMARK_MAX_LENGTH))}
            slotProps={{ htmlInput: { maxLength: REMARK_MAX_LENGTH } }}
            sx={{ marginTop: 1 }}
          />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', marginTop: 0.5, color: "rgba(28,28,30,0.55)" }}>
            {commentText.length} / {REMARK_MAX_LENGTH}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRemarkDialog}>Cancel</Button>
          <Button onClick={submitComment} disabled={!commentText.trim()} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EventList;
