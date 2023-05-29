import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc } from "@firebase/firestore";
import { db } from './../firebase/firebase-config';

interface Match {
  homeTeam: {
    players: string[],
    playersFullName: string[],
    name: string
  },
  awayTeam: {
    players: string[],
    playersFullName: string[],
    name: string
  },
  date: string,
  result: string,
  matchId: string
}

const fetchProfixioDataAndAddToFirestore = async (): Promise<Match[]> => {
  const url = 'https://www.volleytv.no/ss/profixio2json.php?slug=sandvesanden_open_23';
  const slug = url.split('slug=')[1];  
  const slugName = slug.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');  

  try {
    const response = await fetch(url);
    const data: Match[] = await response.json();

    const tournamentDoc = doc(db, "Tournaments", slugName);
    const matchesCollection = collection(tournamentDoc, "Matches");

    await Promise.all(data.map(async (match: Match) => {
      const matchDoc = doc(matchesCollection, match.matchId.toString());
      await setDoc(matchDoc, {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        result: match.result
      });
    }));

    // Returns the data after it is fetched and processed
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

const YourReactComponent: React.FC = () => {
  const [data, setData] = useState<Match[] | null>(null);

  useEffect(() => {
    fetchProfixioDataAndAddToFirestore().then(fetchedData => {
      setData(fetchedData);
    });
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  // You can now use the fetched data in your component's render method
  return (
    <div>
      {data.map(match => (
        <table key={match.matchId} style={{ margin: "20px 0", width: "100%" }}>
          <thead>
            <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Date</th>
              <th>Result</th>
              <th>QR Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{match.homeTeam.name}</td>
              <td>{match.awayTeam.name}</td>
              <td>{match.date}</td>
              <td>{match.result}</td>
              <td><img src="/path/to/your/placeholder/image.jpg" alt="QR code will be here" /></td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default YourReactComponent;
