import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getUID } from '../firebase/auth';
import { getAuth } from 'firebase/auth';

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
 categoryCode : categoryId
});

const parseField = (arena: string, court: string): Field => ({
    name: court,
    arena: { arenaName: arena }
});




const CreateTournament = () => {
    const [tournament, setTournament] = useState<CustomTournament | null>(null);
    const [parsed, isParsed] = useState(false);

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
                date: row[1],
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

            console.log(filteredMatches);
        };
        isParsed(true);
        reader.readAsArrayBuffer(file);
    };

    const sendTournament = async (tournament:CustomTournament | null) => {
      if(tournament === null){
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
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sync/v1/custom/tournament/aa_test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set Content-Type header to application/json
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

    return (
        <div>
            <h1>Upload Tournament Data</h1>
            <input type="file" onChange={handleFile} />
            {tournament && <pre>{JSON.stringify(tournament, null, 2)}</pre>}

            <button onClick={() => sendTournament(tournament)}>Send Inn</button>
        </div>
    );
};
const isRowEmpty = (row: any[]) => row.every(cell => cell === "" || cell === null || cell === undefined);




export default CreateTournament;
