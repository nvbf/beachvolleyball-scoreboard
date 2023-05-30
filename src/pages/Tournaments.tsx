import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc } from "@firebase/firestore";
import { db } from './../firebase/firebase-config';

interface Match {
  homeTeam: {
    playersFullName: string[],
  },
  awayTeam: {
    playersFullName: string[],
  },
  epoch: number,
  court: string,
  matchId: string,
  group: string | null,
  result: string,
  isFinished: boolean,
  referee: string,
  stage: string
}

const fetchProfixioDataAndAddToFirestore = async (): Promise<Match[]> => {
  const url = 'https://www.volleytv.no/ss/profixio2json.php?slug=sandvesanden_open_23';
  const slug = url.split('slug=')[1];  

  try {
    const response = await fetch(url);
    const data: Match[] = await response.json();

    const tournamentDoc = doc(db, "Tournaments", slug);
    const matchesCollection = collection(tournamentDoc, "Matches");

    await Promise.all(data.map(async (match: Match) => {
      const matchDoc = doc(matchesCollection, match.matchId.toString());
      await setDoc(matchDoc, {
        homeTeam: {
          playersFullName: match.homeTeam.playersFullName,
        },
        awayTeam: {
          playersFullName: match.awayTeam.playersFullName,
        },
        epoch: match.epoch,
        court: match.court,
        matchId: match.matchId,
        group: match.group,
        result: match.result,
        isFinished: match.isFinished,
        referee: match.referee,
        stage: match.stage
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

  // When data fetching and processing is done, simply display "complete"
  return (
    <div>
      Complete
    </div>
  );
};

export default YourReactComponent;
