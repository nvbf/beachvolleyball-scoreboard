import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getUID } from '../firebase/auth';
import { getAuth } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { getFirestore } from 'firebase/firestore';
import { RootState } from '../store/store';
import { AdminMatch } from '../components/tournamentAdmin/types';
import { useParams } from 'react-router-dom';
import { fetchMatchesRequest } from '../store/tournamentAdmin/reducer';
import { Grid } from '@mui/material';
import MatchView from "../components/tournamentView/matchView";
import { getInitials } from '../util/names';
import UpdateView from '../components/customTournament/updateView';

// Interface definitions
interface CustomTournament {
  slug: string | null;
  matches: Match[] | null;
}

interface Match {
  id: number | null;
  number: string | null;
  name: string | null;
  date: string | null;
  time: string | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  hasWinner: boolean | null;
  winnerTeam: string | null;
  field: Field | null;
  matchCategory: Category | null;
  sets: Set[] | null;
  refereesTX: Referee[] | null;
}

interface Team {
  name: string;
  isWinner: boolean;
  seeding: number;
}

interface Field {
  name: string;
  arena: Arena;
}

interface Arena {
  arenaName: string;
}

interface Group {
  id: number;
  displayName: string;
  name: string;
}

interface Category {
  categoryCode: string;
}

interface Set {
  number: number;
  pointsHomeTeam: number;
  pointsAwayTeam: number;
}

interface Referee {
  text: string;
}

// Dummy data parsers (to simulate actual extraction logic)
const parseTeam = (data: string): Team => ({
  name: data,
  isWinner: false,
  seeding: 1
});

const parseCategory = (categoryId: string): Category => ({
  categoryCode: categoryId
});

const parseField = (arena: string, court: string): Field => ({
  name: court,
  arena: { arenaName: arena }
});




const CreateTournament = () => {
  function parseAdminMatch(data: Match): AdminMatch {
    const awayTeamName = data.awayTeam?.name?.replace(/^\#\d+\s/, "");
    const homeTeamName = data.homeTeam?.name?.replace(/^\#\d+\s/, "");
    const [name1, name2] = homeTeamName ? homeTeamName.split(" / ") : ["", ""];
    const [name3, name4] = awayTeamName ? awayTeamName.split(" / ") : ["", ""];
    return {
        matchId: +(data.number || ""),
        awayTeam: {
            isWinner: data.awayTeam?.isWinner || false,
            name: data.awayTeam?.name || "",
            player1: (name3 || "").trim(),
            player2: (name4 || "").trim()
        },
        startTime: convertToTimestamp(data.time || "", data.date || ""),
        arenaName: data.field?.name || "",
//        hasWinner: data.hasWinner || "",
        referee: parseTeamString((data.refereesTX || [])[0]?.text|| ""),
        homeTeam: {
            isWinner: data.homeTeam?.isWinner || false,
            name: data.homeTeam?.name || "",
            player1: (name1 || "").trim(),
            player2: (name2 || "").trim()
        },
        matchCategory: data.matchCategory?.categoryCode || "",
        matchGroup: "",
        name: data.name || "",
        currentSetScore: { "HOME": 0, "AWAY": 0 },
        currentScore: [{ "HOME": 0, "AWAY": 0 }],
        sets:  [{ "HOME": 0, "AWAY": 0 }],
        hasWinner: false,
        isFinalized: false,
        isStarted: false,
        scoreboardID: "",
        startTimestamp: 0
    };

function convertToTimestamp(time: string, date: string): number {
    const dateStr = `${date}T${time}`;
    const dateObj = new Date(dateStr);

    // convert to milliseconds since epoch
    const timestampInMilliseconds = dateObj.getTime();

    return timestampInMilliseconds;
}

function parseTeamString(team: string): string {
    if (team === "") {
        return ""
    }

    // convert to milliseconds since epoch
    const teamNames = team.replace(/^\#\d+\s/, "");

    const [name1, name2] = teamNames ? teamNames.split(" / ") : ["", ""];

    if (!name2) {
        return name1;
    }

    return `${getInitials(name1)} / ${getInitials(name2)}`;
}}
  const [tournament, setTournament] = useState<CustomTournament | null>(null);
  const [adminMatches, setAdminMatches] = useState<AdminMatch[]>([]);
  const [parsed, isParsed] = useState(false);
  const searchParams = new URLSearchParams(location.search);

  const [fetchedMatches, setFetchedMatches] = useState(false);
    const params = useParams();
    const playerClass = searchParams.get('class');

  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : "nevza_oddanesand_24";
  const dispatch = useDispatch();
  let db = getFirestore()

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches);
  const matchesList: AdminMatch[] = Object.values(matches.matches);

  // Fetch the matches when the component mounts
  if (!fetchedMatches && tournamentSlug) {
    setFetchedMatches(true)
    dispatch(fetchMatchesRequest({ tournamentSlug: tournamentSlug, class: playerClass }));
  }
    

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files ? event.target.files[0] : null;
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
          
            const filteredMatches = rows.slice(1).map((row: any[], index: number): Match|null => {
              if (isRowEmpty(row)) {
                  console.log(`Row ${index + 1} is empty and will be skipped.`);
                  return null; // Return null for empty rows or handle it as needed
              }
      
              // If the row is not empty, process it normally
              return {
                id: row[0],
                number: (row[0] as number).toString().trim(),
                name: row[6],
                date: convertDateToISO(row[1]),
                time: row[2].trim(),
                homeTeam: parseTeam(row[7]),
                awayTeam: parseTeam(row[8]),
                hasWinner: false,
                winnerTeam: null,
                field: parseField(row[3], row[4]),
                matchCategory: parseCategory(row[5]),
                sets: [],
                refereesTX: [{text: row[9]}]
                  // other properties
              };
          }).filter(match => match !== null); // Remove null entries

            setTournament({
                slug: "tournament-2024",
                matches: filteredMatches as Match[]
            });

            
            console.log((filteredMatches as Match[]).map(e => parseAdminMatch(e)));
            setAdminMatches((filteredMatches as Match[]).map(e => parseAdminMatch(e)));

        };

      isParsed(true);
      reader.readAsArrayBuffer(file);
    };

  const sendTournament = async (tournament: CustomTournament | null) => {
    if (tournament === null) {
      return;
    }

    try {
      const uid = await getUID()
      console.log('Logged in with uid', uid)

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const idToken = await user.getIdToken(); // Retrieve the Firebase ID token

      console.log('Logged in with uid', user.uid);

      console.log(tournament);

      console.log(JSON.stringify(tournament));


      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sync/v1/custom/tournament/aa_test_csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type header to application/json
          'Authorization': `Bearer ${idToken}`, // Include the ID token in the Authorization header
        },
        body: JSON.stringify(tournament),
      });

      if (response.status === 403) {
        throw new Error('Forbidden: Access is denied');
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

    const renderMatches = (matches: AdminMatch[], existingMatches: AdminMatch[]) => {
      return (
        <Grid container
          spacing={0}
          rowSpacing={0}
          columns={12}
          justifyContent="space-evenly"
          alignItems="center">
  
  {matches.sort((a, b) => (a.matchId - b.matchId)).map((match, index) => {
        const existing = existingMatches.find(e => e.matchId === match.matchId);
        console.log('Rendering:', match, 'Existing:', existing);
        return (
          <Grid item key={index} xs={12} margin={0}>
            <UpdateView newMatch={match} existingMatch={existing || null} />
          </Grid>
        );
      })}
        </Grid>
      );
    };
    
    return (
        <div>
            <h1>Upload Tournament Data</h1>
            <input type="file" onChange={handleFile} />
            {/* {tournament && <pre>{JSON.stringify(tournament, null, 2)}</pre>} */}

            <button onClick={() => sendTournament(tournament)}>Send Inn</button>
            <Grid container
      rowSpacing={1}
      columnSpacing={0}
      columns={12}
      justifyContent="space-evenly"
      alignItems="center"
      marginTop={1}
    >
      <Grid item xs={12}>
        {renderMatches(adminMatches, matchesList )}
      </Grid>
    </Grid>
        </div>
    );
};
const isRowEmpty = (row: any[]) => row.every(cell => cell === "" || cell === null || cell === undefined);

function convertDateToISO(dateString: any) {
  const parts = dateString.split(".");
  if (parts.length === 3) {
    // parts[2] er året, parts[1] er måneden, og parts[0] er dagen
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return null; // returner null hvis formatet ikke er som forventet
}



export default CreateTournament;
