import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { fetchMatchesSuccess, fetchMatchesFailure, fetchMatchDatesSuccess, fetchMatchesRequest, fetchMatchFieldsSuccess, FetchMatchesPayload, addSecrets, fetchMatchSecrets, setLoader, fetchMatchClassesSuccess } from './reducer'
import { collection, getDocs, doc, QuerySnapshot } from "@firebase/firestore";
import { db } from './../../firebase/firebase-config';
import { PayloadAction } from '@reduxjs/toolkit';
import { AdminMatch } from '../../components/tournamentAdmin/types';
import { QueryFieldFilterConstraint, getDoc, query, where } from 'firebase/firestore';
import { parseAdminMatch } from '../../components/tournamentAdmin/adminMatchFunctions';
import { getTournamentSecrets } from '../../firebase/match_service';
import { TournamentSecrets } from '../../components/types';

function* fetchDatesFromFirestore(action: PayloadAction<FetchMatchesPayload>): SagaIterator {
    try {
        console.log("fetching dates");
        const tournamentSlug = action.payload.tournamentSlug;

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
        yield put(fetchMatchDatesSuccess(datesList));

    } catch (error) {
        yield put(fetchMatchesFailure((error as Error).message));
    }
}

function* fetchClassesFromFirestore(action: PayloadAction<FetchMatchesPayload>): SagaIterator {
    try {
        console.log("fetching dates");
        const tournamentSlug = action.payload.tournamentSlug;

        const q = query(collection(db, "Tournaments", tournamentSlug, "Matches"));
        // Get the result of the query
        const matchesSnapshot: QuerySnapshot = yield call(getDocs, q);


        const uniqueClassesNames = new Set<string>();

        // Loop through the documents in the result
        matchesSnapshot.docs.forEach((doc) => {
            const matchData = doc.data();
            if (matchData && matchData.MatchCategory && matchData.MatchCategory.CategoryCode) {
                uniqueClassesNames.add(matchData.MatchCategory.CategoryCode);
            }
        });

        const sortedPlayerClasses = [...uniqueClassesNames].sort((a, b) => (a > b ? 0 : 1))

        console.log("Classes fetched from Firestore: ", uniqueClassesNames);
        yield put(fetchMatchClassesSuccess(sortedPlayerClasses));

    } catch (error) {
        yield put(fetchMatchesFailure((error as Error).message));
    }
}

function* fetchArenaNamesFromFirestore(action: PayloadAction<FetchMatchesPayload>): SagaIterator {
    try {
        console.log("fetching arnea names");
        const tournamentSlug = action.payload.tournamentSlug;
        const playerClass = action.payload.class;

        let collectionQuery: QueryFieldFilterConstraint[] = []
        if (playerClass != null) {
            collectionQuery.push(where("MatchCategory.CategoryCode", "==", playerClass))
        }

        const q = query(collection(db, "Tournaments", tournamentSlug, "Matches"), ...collectionQuery);
        // Get the result of the query
        const matchesSnapshot: QuerySnapshot = yield call(getDocs, q);


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
        yield put(fetchMatchFieldsSuccess(sortedArenaNames));
    } catch (error) {
        yield put(fetchMatchesFailure((error as Error).message));
    }
}

function* fetchMatchesFromFirestore(action: PayloadAction<FetchMatchesPayload>): SagaIterator {
    try {
        console.log("fetching matches");
        const tournamentSlug = action.payload.tournamentSlug;
        const playerClass = action.payload.class;

        let collectionQuery: QueryFieldFilterConstraint[] = []
        if (playerClass != null) {
            collectionQuery.push(where("MatchCategory.CategoryCode", "==", playerClass))
        }

        const q = query(collection(db, "Tournaments", tournamentSlug, "Matches"), ...collectionQuery);
        // Get the result of the query
        const matchesSnapshot: QuerySnapshot = yield call(getDocs, q);

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
        console.log("Data fetched from Firestore error: ", error);

        yield put(fetchMatchesFailure((error as Error).message));
    }
}

function* getMatcheSecretFromFirestore(action: PayloadAction<FetchMatchesPayload>): SagaIterator {
    try {
        console.log("check events with id %s", action.payload.tournamentSlug);

        // add a new document with a generated id
        let tournamentSecrets = yield call(getTournamentSecrets, action.payload.tournamentSlug);

        console.log(tournamentSecrets)

        yield put(addSecrets(tournamentSecrets))
        yield put(setLoader(false))
        console.log("Saved secrets");
    } catch (error) {
        yield put(setLoader(false))
        console.log("Error when getting secrets ", error);
    }
}

export function* tournamentAdminSagas() {
    yield all([
        takeEvery(fetchMatchesRequest.type, fetchMatchesFromFirestore),
        takeEvery(fetchMatchesRequest.type, fetchDatesFromFirestore),
        takeEvery(fetchMatchesRequest.type, fetchArenaNamesFromFirestore),
        takeEvery(fetchMatchesRequest.type, fetchClassesFromFirestore),
        takeEvery(fetchMatchSecrets.type, getMatcheSecretFromFirestore),
    ])

}

