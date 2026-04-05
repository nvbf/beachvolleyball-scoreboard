import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc } from "@firebase/firestore";
import { db } from './../firebase/firebase-config';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
        <Grid size={12} key={tournament.slug}>
          <Grid container
            spacing={0}
            rowSpacing={0}
            columns={12}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid size={12} key={index}>
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
        <Grid size={12} key={tournament.slug}>
          <Grid container
            spacing={0}
            rowSpacing={0}
            columns={12}
            justifyContent="space-evenly"
            alignItems="center">
            <Grid size={12} key={index}>
              <TournamentView tournament={tournament} />
            </Grid>
          </Grid>
        </Grid>
      ))}

      {(() => {
        const pastTournaments = tournaments
          .filter((e) => isPast(e.endDate))
          .sort((a, b) => b.startDate.localeCompare(a.startDate));

        if (pastTournaments.length === 0) return null;

        const currentYear = new Date().getFullYear();

        const byYear = pastTournaments.reduce((acc, t) => {
          const year = new Date(t.endDate).getFullYear().toString();
          if (!acc[year]) acc[year] = [];
          acc[year].push(t);
          return acc;
        }, {} as Record<string, Tournament[]>);

        const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

        return (
          <>
            <Typography sx={{ fontSize: 24, alignSelf: 'center', textAlign: 'center', marginTop: 1 }} variant="h1" color="text.secondary" gutterBottom>
              Previous:
            </Typography>
            <Grid size={12}>
              {years.map((year) => {
                const yearTournaments = byYear[year];
                const totalMatches = yearTournaments.reduce((sum, t) => sum + (t.numberOfMatches ?? 0), 0);
                const isCurrentYear = Number(year) === currentYear;
                return (
                  <Accordion key={year} defaultExpanded={isCurrentYear} disableGutters sx={{ background: 'transparent', boxShadow: 'none' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>
                        {year} — {yearTournaments.length} tournament{yearTournaments.length !== 1 ? 's' : ''}, {totalMatches} match{totalMatches !== 1 ? 'es' : ''}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: 0 }}>
                      {yearTournaments.map((tournament) => (
                        <TournamentView key={tournament.slug} tournament={tournament} />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Grid>
          </>
        );
      })()}
    </Grid>
    );
  };

  // When data fetching and processing is done, simply display "complete"
  return (
    renderMatches(data)
  );

};

export default YourReactComponent;
