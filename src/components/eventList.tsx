import React, { useState } from "react";
import { Event, EventType, TeamType } from "./types";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useAppSelector } from "../store/store";
import moment from "moment";


const EventList: React.FC = () => {
  const match = useAppSelector((state) => state.match);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpansion = () => {
    setIsExpanded((expanded) => !expanded);
  };

  const formattedEvent = (event: Event): JSX.Element => {
    const eventTypeString = eventTypeToString(event.eventType);
    const teamString = teamToString(event.team);
    const playerName = event.playerId.toString(); // replace with actual player name
    const undoneString = event.undone ? <del>Undone</del> : "";
    const reference = event.reference ? `(${event.reference})` : "";
    const elapsed = match.startTime === 0 ? moment.duration(0) : moment.duration(event.timestamp - match.startTime)
    let hours = elapsed.hours().toString();
    let minutes = elapsed.minutes().toString();
    let seconds = elapsed.seconds().toString();
    let formattedTime = "";

    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }

    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }

    if (elapsed.asHours() === 0) {
      formattedTime = `${minutes}:${seconds}`;
    } else {
      formattedTime = `${hours}:${minutes}:${seconds}`;
    }
    return (
      <Typography variant="body1">
        <span style={{ textDecoration: undoneString ? "line-through" : "none" }}>
          {formattedTime}: {eventTypeString} - {teamString} {reference}
        </span>
      </Typography>
    );
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

  const sortedEvents = [...match.events].sort((a, b) => b.timestamp - a.timestamp).filter(e => e.eventType !== EventType.Undo);
  const slicedEvents = isExpanded ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <Grid item xs={12} sx={{ alignSelf: 'center', textAlign: 'center' }} marginTop={4}>
      {slicedEvents.map((event) => (
        <div key={event.id}>
          {formattedEvent(event)}
        </div>
      ))}
      {match.events.length > 3 && (
        <Button variant="contained" onClick={toggleExpansion}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </Grid>
  );
};

export default EventList;
