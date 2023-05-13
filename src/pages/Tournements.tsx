// import RaisedButton from "@mui/material/RaisedButton";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

interface Match {
  id: string;
  finished: boolean;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  score: number[];
  setNumber: number;
}

function Tournements() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const matchesCollection = collection(db, 'MatchID'); // Replace with the correct collection name
      const matchesSnapshot = await getDocs(matchesCollection);
      const matchesData: Match[] = matchesSnapshot.docs.map((doc) => ({
        id: doc.id,
        finished: doc.data().finished,
        player1: doc.data().player1,
        player2: doc.data().player2,
        player3: doc.data().player3,
        player4: doc.data().player4,
        score: doc.data().score,
        setNumber: doc.data().setNumber,
      }));
      console.log(matchesData); // Log the retrieved data
      setMatches(matchesData);
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <div>
        <main>
          {matches.map((match) => (
            <div key={match.id}>
              {/* Display match details here */}
              <h3>Match ID: {match.id}</h3>
              <p>Player 1: {match.player1}</p>
              <p>Player 2: {match.player2}</p>
              <p>Player 3: {match.player3}</p>
              <p>Player 4: {match.player4}</p>
              <p>Score: {match.score.join('-')}</p>
              <p>Set Number: {match.setNumber}</p>
              <p>Finished: {match.finished ? 'Yes' : 'No'}</p>
              {/* ... */}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default Tournements;