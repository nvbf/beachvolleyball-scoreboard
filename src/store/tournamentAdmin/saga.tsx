import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { fetchMatchesSuccess, fetchMatchesFailure, TournamentAdminTypes, fetchFieldsSuccess, fetchDatesSuccess } from './action';
import { collection, getDocs, doc, QuerySnapshot } from "@firebase/firestore";
import { db } from './../../firebase/firebase-config';
import { PayloadAction } from '@reduxjs/toolkit';
import { AdminMatch } from '../../components/tournamentAdmin/types';
import { getDoc } from 'firebase/firestore';
import { parseAdminMatch } from '../../components/tournamentAdmin/adminMatchFunctions';

function* fetchDatesFromFirestore(action: PayloadAction<string>): SagaIterator {
    try {
        console.log("fetching dates");
        const tournamentSlug = action.payload;

        const tournamentDocRef = doc(db, "Tournaments", tournamentSlug);
        // Get the result of the query
        const torunamentSnapshot = yield call(getDoc, tournamentDocRef);


        // Loop through the documents in the result
        const data = torunamentSnapshot.data();
        const startDate = new Date(data.StartDate);
        const endDate = new Date(data.EndDate);

        const datesList: string[] = [];

        // Loop through each date between the start and end date
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const currentDate = date.toISOString().split("T")[0];
            datesList.push(currentDate);
        }

        console.log("Dates fetched from Firestore: ", datesList);
        yield put(fetchDatesSuccess(datesList));

    } catch (error) {
        yield put(fetchMatchesFailure((error as Error).message));
    }
}

function* fetchArenaNamesFromFirestore(action: PayloadAction<string>): SagaIterator {
    try {
        console.log("fetching arnea names");
        const tournamentSlug = action.payload;

        const matchesCollection = collection(db, "Tournaments", tournamentSlug, "Matches");
        // Get the result of the query
        const matchesSnapshot: QuerySnapshot = yield call(getDocs, matchesCollection);


        const uniqueArenaNames = new Set<string>();

        // Loop through the documents in the result
        matchesSnapshot.docs.forEach((doc) => {
            const matchData = doc.data();
            if (matchData && matchData.Field && matchData.Field.Name) {
                uniqueArenaNames.add(matchData.Field.Name);
            }
        });
        const sortedArenaNames = [...uniqueArenaNames].sort((a, b) => {
            const prefixA = a.match(/^\D+/)?.[0] || ''; // Extract the prefix of a
            const prefixB = b.match(/^\D+/)?.[0] || ''; // Extract the prefix of b

            if (prefixA === prefixB) {
                const aNumber = parseInt(a.replace(prefixA, '')); // Extract the numeric part of a
                const bNumber = parseInt(b.replace(prefixB, '')); // Extract the numeric part of b

                return aNumber - bNumber; // Compare the numeric values within the group
            } else {
                return prefixA.localeCompare(prefixB); // Compare the prefixes alphabetically
            }
        });
        // yield put(fetchMatchesSuccess({ matches: matchesData }));
        console.log("Fields fetched from Firestore: ", sortedArenaNames);
        yield put(fetchFieldsSuccess(sortedArenaNames));

    } catch (error) {
        yield put(fetchMatchesFailure((error as Error).message));
    }
}

function* fetchMatchesFromFirestore(action: PayloadAction<string>): SagaIterator {
    try {
        console.log("fetching matches");
        const tournamentSlug = action.payload;

        const matchesCollection = collection(db, "Tournaments", tournamentSlug, "Matches");
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

export function* tournamentAdminSagas() {
    yield all([
        takeEvery(TournamentAdminTypes.FETCH_MATCHES_REQUEST, fetchMatchesFromFirestore),
        takeEvery(TournamentAdminTypes.FETCH_MATCHES_REQUEST, fetchDatesFromFirestore),
        takeEvery(TournamentAdminTypes.FETCH_MATCHES_REQUEST, fetchArenaNamesFromFirestore),
    ])

}

