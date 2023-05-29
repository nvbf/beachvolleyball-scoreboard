import { collection, doc, setDoc } from "@firebase/firestore";
import { db } from './../firebase/firebase-config';
import { addDoc } from "firebase/firestore";

// Define a Match type
interface Match {
  homeTeam: string;
  awayTeam: string;
  date: string;
  result: string;
}

const fetchProfixioDataAndAddToFirestore = async () => {
  const url = 'https://www.volleytv.no/ss/profixio2json.php?slug=sandvesanden_open_23';
  const slug = url.split('slug=')[1];

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Modify slug to desired format (e.g. "Sandvesanden Open 23")
    const slugFormatted = slug.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Use slugFormatted as document id
    const tournamentDoc = doc(collection(db, "Tournaments"), slugFormatted);

    data.forEach(async (match: Match) => {
      // Add a sub-collection "Matches" to each tournament
      const matchCollection = collection(tournamentDoc, "Matches");

      // create a new document in Firestore for each match
      await addDoc(matchCollection, {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        result: match.result
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

export default fetchProfixioDataAndAddToFirestore;
