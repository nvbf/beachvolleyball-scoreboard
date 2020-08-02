const sortGames = (a, b) => {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

const getCourtGames = (gameSchedule, court) => {
  return gameSchedule
    .filter(game => game.court == court)
    .sort(sortGames)

}

export function getCurrentMatchId(matches, gameSchedule, court) {
  console.log('Matches', matches);
  console.log('Game schedule', gameSchedule);
  console.log('Court',court);
  const courtGames = getCourtGames(gameSchedule, court);

  for (const game of courtGames) {
    const firebaseMatch = matches.find(m => m.matchId == game.matchId);
    if (!firebaseMatch) {
      console.log('No match found for ' , game.matchId)
      continue;
    }

    // The first unfinished match sounds good:
    if (!firebaseMatch.isFinished) {
      console.log('Firebase Found not finished game', firebaseMatch);
      return firebaseMatch;
    }

    // If the game finished less than a minute ago,
    // show the same match:
    if (firebaseMatch.timeFinished && firebaseMatch.timeFinished/1000 > new Date().getTime()/1000 - (60*2) ) {
      console.log('Firebase Got a match finished at ', firebaseMatch.timeFinished, new Date().getTime()/1000)
      return firebaseMatch;
    }

    // For the next minute, show the next matches:
    if (firebaseMatch.timeFinished && firebaseMatch.timeFinished/1000 > new Date().getTime()/1000 - (60*3) ) {
      return null;
    }
  }
  // If we came so far far and no game found, it's probably not added to firebase yet:
  return null;
}

export function getNextGames(matches, gameSchedule, court) {
  const courtGames = getCourtGames(gameSchedule, court);

  const nextGames = [];
  for (const game of courtGames) {
    const firebaseMatch = matches.find(m => m.matchId == game.matchId);

    if (!firebaseMatch) {
      nextGames.push(game);
      continue;
    }

    // The first unfinished match sounds good:
    if (firebaseMatch.isFinished) {
      console.log('Found finished game', firebaseMatch);
      continue;
    }

    nextGames.push(game);
  }

  return nextGames;
}
