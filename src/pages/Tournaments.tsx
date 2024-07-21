import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc } from "@firebase/firestore";
import { db } from './../firebase/firebase-config';
import { Grid, Typography } from '@mui/material';
import MatchView from '../components/tournamentView/matchView';
import TournamentView from '../components/tournamentsOverview/tournamentView';
import { getDocs } from 'firebase/firestore';
import { isIncoming, isOngoing, isPast } from '../util/time';

interface Tournament {
  endDate: string,
  startDate: string,
  name: string,
  slug: string,
  type: string,
  numberOfMatches: number | null,
  numberOfScoreboards: number | null,
}

const fetchTournaments = async (): Promise<Tournament[]> => {
  try {

    const tournamentCollection = collection(db, "Tournaments");

    const valueSnapshot = await getDocs(tournamentCollection);
    const tournamentList: Tournament[] = valueSnapshot.docs.map((doc) => ({
      endDate: doc.data().EndDate,
      startDate: doc.data().StartDate,
      name: doc.data().Name,
      slug: doc.data().Slug,
      type: doc.data().Type,
      numberOfMatches: doc.data().NumberOfMatches,
      numberOfScoreboards: doc.data().NumberOfScoreboards,
    }));

    console.log(tournamentList)

    // Returns the data after it is fetched and processed
    return tournamentList;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

const YourReactComponent: React.FC = () => {
  const [data, setData] = useState<Tournament[] | null>(null);

  useEffect(() => {
    fetchTournaments().then(fetchedData => {
      setData(fetchedData);
    });
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  const renderMatches = (tournaments: Tournament[]) => {
    return (<Grid container
      rowSpacing={1}
      columnSpacing={0}
      columns={12}
      justifyContent="space-evenly"
      alignItems="center"
      marginTop={1}
    >
      {tournaments.filter((e) =>
        isOngoing(e.startDate, e.endDate)
      ).length > 0 && <Typography sx={{ fontSize: 24, alignSelf: 'center', textAlign: 'center', marginTop: 1 }} variant="h1" color="text.secondary" gutterBottom>
          Active:
        </Typography>}

      {tournaments.sort(
        (a, b) => ((a.startDate < b.startDate) ? 1 : 0)
      ).filter((e) =>
        isOngoing(e.startDate, e.endDate)
      ).map((tournament, index) => (
        <Grid item key={tournament.slug} xs={12}>
          <Grid container
            spacing={0}
            rowSpacing={0}
            columns={12}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid item key={index} xs={12}>
              <TournamentView tournament={tournament} />
            </Grid>
          </Grid>
        </Grid>
      ))}
      {tournaments.filter((e) =>
        isIncoming(e.startDate) && e.numberOfMatches
      ).length > 0 && <Typography sx={{ fontSize: 24, alignSelf: 'center', textAlign: 'center', marginTop: 1 }} variant="h1" color="text.secondary" gutterBottom>
          Upcoming:
        </Typography>}

      {tournaments.sort(
        (a, b) => ((a.startDate < b.startDate) ? 0 : 1)
      ).filter((e) =>
        isIncoming(e.startDate) && e.numberOfMatches
      ).map((tournament, index) => (
        <Grid item key={tournament.slug} xs={12}>
          <Grid container
            spacing={0}
            rowSpacing={0}
            columns={12}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid item key={index} xs={12}>
              <TournamentView tournament={tournament} />
            </Grid>
          </Grid>
        </Grid>
      ))}

      {tournaments.filter((e) =>
        isPast(e.endDate)
      ).length > 0 && <Typography sx={{ fontSize: 24, alignSelf: 'center', textAlign: 'center', marginTop: 1 }} variant="h1" color="text.secondary" gutterBottom>
          Previous:
        </Typography>}

      {tournaments.sort(
        (a, b) => ((a.startDate < b.startDate) ? 1 : 0)
      ).filter((e) =>
        isPast(e.endDate)
      ).map((tournament, index) => (
        <Grid item key={tournament.slug} xs={12}>
          <Grid container
            spacing={0}
            rowSpacing={0}
            columns={12}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid item key={index} xs={12}>
              <TournamentView tournament={tournament} />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
    );
  };

  // When data fetching and processing is done, simply display "complete"
  return (
    renderMatches(data)
  );

};

export default YourReactComponent;
