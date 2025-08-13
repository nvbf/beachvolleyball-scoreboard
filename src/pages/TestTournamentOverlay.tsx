import { AdminMatch } from "../components/tournamentAdmin/types";
import { useState } from "react";
import TournamentOverlay from "../components/tournamentOverlay/tournamentOverlay";
import {
  getComingMatches,
  getCurrentMatch,
  normalizeServerMatches,
} from "../util/overlay";

const TestTournamentOverlay = () => {
  const [matchesList, setMatchesList] = useState<AdminMatch[]>(getMatchList());

  const courtID = "Bane 1";

  const handleStartNextMatch = () => {
    setMatchesList((matchesList) => {
      const nextMatches = getComingMatches(matchesList, courtID);
      if (nextMatches.length === 0) {
        return matchesList;
      }
      const nextMatchId = nextMatches[0].matchId;
      return matchesList.map((match) => {
        if (match.matchId === nextMatchId) {
          return {
            ...match,
            isStarted: true,
          };
        }
        return match;
      });
    });
  };

  const handlEndCurrentMatch = () => {
    setMatchesList((matchesList) => {
      const currentMatch = getCurrentMatch(matchesList, courtID);
      if (!currentMatch) {
        return matchesList;
      }

      return matchesList.map((match) => {
        if (match.matchId === currentMatch.matchId) {
          return {
            ...match,
            isFinalized: true,
            hasWinner: true,
          };
        }
        return match;
      });
    });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#ccc",
          textAlign: "center",
          width: "200px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <button onClick={handleStartNextMatch}>Start next match</button>
        <button onClick={handlEndCurrentMatch}>End current match</button>
      </div>
      <div
        style={{
          position: "relative",
          transform: "scale(0.5)",
          transformOrigin: "0 0",
          width: "1920px",
          height: "1080px",
          border: "1px solid red",
          backgroundColor: "#8c8f91",
        }}
      >
        <TournamentOverlay matchesList={matchesList} courtID={courtID} />
      </div>
    </>
  );
};

export default TestTournamentOverlay;

function getMatchList(): AdminMatch[] {
  return normalizeServerMatches([
    {
      matchId: 1,
      awayTeam: {
        isWinner: false,
        name: "Iver Horrem / Tarjai Skarlund",
        player1: "Iver Horrem",
        player2: "Tarjai Skarlund",
      },
      currentScore: [
        {
          AWAY: 14,
          HOME: 21,
        },
        {
          HOME: 21,
          AWAY: 7,
        },
      ],
      currentSetScore: {
        AWAY: 0,
        HOME: 2,
      },
      startTime: 1754643600000,
      startTimestamp: 1754643659715,
      arenaName: "Bane 1",
      isStarted: false,
      isFinalized: false,
      hasWinner: false,
      referee: "Referee 1 / Referee 2",
      homeTeam: {
        isWinner: true,
        name: "Sindre Svendby / Siri Okkenhaug",
        player1: "Sindre Svendby",
        player2: "Siri Okkenhaug",
      },
      matchCategory: "K",
      matchGroup: "A",
      sets: [
        {
          PointsHomeTeam: 21,
          PointsAwayTeam: 14,
          Number: 1,
        },
        {
          PointsAwayTeam: 7,
          Number: 2,
          PointsHomeTeam: 21,
        },
      ],
      name: "",
      scoreboardID: "86b7934a-5350-4eac-a09f-e98b9f71abba",
    },
    {
      matchId: 10,
      awayTeam: {
        isWinner: false,
        name: "Vegar Løkken / Erlend Henriksveen",
        player1: "Vegar Løkken",
        player2: "Erlend Henriksveen",
      },
      currentScore: [
        {
          AWAY: 12,
          HOME: 21,
        },
        {
          AWAY: 13,
          HOME: 21,
        },
      ],
      currentSetScore: {
        HOME: 2,
        AWAY: 0,
      },
      startTime: 1754649600000,
      startTimestamp: 1754649630128,
      arenaName: "Bane 2",
      isStarted: false,
      isFinalized: false,
      hasWinner: false,
      referee: "Referee 1 / Referee 2",
      homeTeam: {
        isWinner: true,
        name: "Anders Mol / Christian Sørum",
        player1: "Anders Mol",
        player2: "Christian Sørum",
      },
      matchCategory: "M",
      matchGroup: "B",
      sets: [
        {
          Number: 1,
          PointsAwayTeam: 12,
          PointsHomeTeam: 21,
        },
        {
          PointsHomeTeam: 21,
          PointsAwayTeam: 13,
          Number: 2,
        },
      ],
      name: "",
      scoreboardID: "8ab7c76a-248d-45f9-9bbd-47d0dc3f2e0e",
    },
    {
      matchId: 11,
      awayTeam: {
        isWinner: false,
        name: "Eivind Johansen / Aslak Johansen",
        player1: "Eivind Johansen",
        player2: "Aslak Johansen",
      },
      currentScore: [
        {
          HOME: 16,
          AWAY: 21,
        },
        {
          AWAY: 18,
          HOME: 21,
        },
        {
          HOME: 15,
          AWAY: 13,
        },
      ],
      currentSetScore: {
        HOME: 2,
        AWAY: 1,
      },
      startTime: 1754649600000,
      startTimestamp: 1754649979118,
      arenaName: "Bane 1",
      isStarted: false,
      isFinalized: false,
      hasWinner: false,
      referee: "Ref 1 / Ref 2",
      homeTeam: {
        isWinner: true,
        name: "Håkon Tveitan / Øystein Veien",
        player1: "Håkon Tveitan",
        player2: "Øystein Veien",
      },
      matchCategory: "M",
      matchGroup: "A",
      sets: [
        {
          PointsHomeTeam: 16,
          Number: 1,
          PointsAwayTeam: 21,
        },
        {
          Number: 2,
          PointsAwayTeam: 18,
          PointsHomeTeam: 21,
        },
        {
          PointsAwayTeam: 13,
          PointsHomeTeam: 15,
          Number: 3,
        },
      ],
      name: "",
      scoreboardID: "7255947b-6c93-4f69-b72e-ad1af8ad951c",
    },
  ]);
}
