import React, { useState } from "react";
import { Event, EventType, TeamType } from "./types";
import { Box, Button, Typography } from "@mui/material";

interface Props {
  events: Event[];
}

const EventList: React.FC<Props> = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpansion = () => {
    setIsExpanded((expanded) => !expanded);
  };

  const formattedEvent = (event: Event): JSX.Element => {
    const eventTypeString = eventTypeToString(event.eventType);
    const teamString = teamToString(event.team);
    const playerName = event.playerId.toString(); // replace with actual player name
    const undoneString = event.undone ? <del>Undone</del> : "";
    const timestampString = new Date(event.timestamp).toLocaleTimeString([], { hour12: false });
    return (
      <Typography variant="body1">
        <span style={{ textDecoration: undoneString ? "line-through" : "none" }}>
          {timestampString}: {eventTypeString} - {teamString} 
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

  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp).filter(e => e.eventType !== EventType.Undo);
  const slicedEvents = isExpanded ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <Box mt={2}>
      {slicedEvents.map((event) => (
        <Box key={event.id} mb={1}>
          {formattedEvent(event)}
        </Box>
      ))}
      {events.length > 3 && (
        <Button variant="contained" onClick={toggleExpansion}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
};

export default EventList;
