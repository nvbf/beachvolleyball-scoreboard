import React from "react";
import { useLocation } from "react-router-dom";

const TournamentOverlay = () => {
  const location = useLocation();

  // Extract the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tournamentID = queryParams.get("tournamentID") || "default";
  const matchID = queryParams.get("matchID") || "default";
  const courtID = queryParams.get("courtID") || "default";

  // Hardcoded mapping of IDs to names
  const tournamentNames = {
    "12321": "Oslo Masters",
    default: "Unknown Tournament",
  };
  const matchNames = { "12333": "Gruppespill A", default: "Unknown Match" };
  const courtNames = { "1222": "Bane 1", default: "Unknown Court" };

  // Players and scores
  const player1 = "Player1";
  const player2 = "Player2";
  const player3 = "Player3";
  const player4 = "Player4";
  const scoreTeam1 = 15;
  const scoreTeam2 = 20;

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        padding: "10px",
        backgroundColor: "rgba(0,0,0,0.7)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "16px",
        }}
      >
        <div>
          {tournamentNames[tournamentID as keyof typeof tournamentNames]}
        </div>
        <div>{matchNames[matchID as keyof typeof matchNames]}</div>
        <div>{courtNames[courtID as keyof typeof courtNames]}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          margin: "10px",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <div>
            <strong>{player1}</strong> & <strong>{player2}</strong>
          </div>
          <div style={{ fontSize: "32px", marginTop: "5px" }}>{scoreTeam1}</div>
        </div>
        <div>vs</div>
        <div style={{ marginLeft: "10px" }}>
          <div>
            <strong>{player3}</strong> & <strong>{player4}</strong>
          </div>
          <div style={{ fontSize: "32px", marginTop: "5px" }}>{scoreTeam2}</div>
        </div>
      </div>
    </div>
  );
};

export default TournamentOverlay;
