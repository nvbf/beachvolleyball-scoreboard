import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { fetchMatchesSuccess, fetchMatchesFailure, TournamentAdminTypes } from './action';
import { collection, getDocs, doc, QuerySnapshot } from "@firebase/firestore";
import { db } from './../../firebase/firebase-config';
import { PayloadAction } from '@reduxjs/toolkit';
import { AdminMatch } from '../../components/tournamentAdmin/types';
import { DocumentData } from 'firebase/firestore';
import { parseAdminMatch } from '../../components/tournamentAdmin/adminMatchFunctions';

// interface MatchData {
//     awayTeam: {
//         isWinner: boolean;
//         name: string;
//     };
//     currentScore: string;
//     currentSetScore: { Away: number, Home: number };
//     date: string;
//     arenaName: string;
//     hasWinner: boolean;
//     homeTeam: {
//         isWinner: boolean;
//         name: string;
//     };
//     matchCategory: string;
//     matchGroup: string;
//     name: string;
//     scoreboardID: string;
// }


function* fetchMatchesFromFirestore(action: PayloadAction<string>): SagaIterator {
    try {
        console.log("fetching matches");
        const tournamentSlug = action.payload;
        console.log("tournament slug %s", tournamentSlug);

        const tournamentDocRef = doc(db, "Tournaments", tournamentSlug);
        const matchesCollection = collection(tournamentDocRef, "Matches");
        console.log("Matches Collection Path: ", matchesCollection.path); // Log the path to the Matches Collection
        // Get the result of the query
        const matchesSnapshot: QuerySnapshot = yield call(getDocs, matchesCollection);

        const matchesData: AdminMatch[] = [];

        // Loop through the documents in the result
        matchesSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            let formattedData = parseAdminMatch(data)

            matchesData.push(formattedData);
        });

        yield put(fetchMatchesSuccess({ matches: matchesData }));
        console.log("Data fetched from Firestore: ", matchesData);
    } catch (error) {
        yield put(fetchMatchesFailure((error as Error).message));
    }
}

// export function* watchFetchMatches() {
//     yield takeLatest(FETCH_MATCHES_REQUEST as string, fetchMatches);

// }
export function* tournamentAdminSagas() {
    yield all([
        takeEvery(TournamentAdminTypes.FETCH_MATCHES_REQUEST, fetchMatchesFromFirestore),
    ])

}

