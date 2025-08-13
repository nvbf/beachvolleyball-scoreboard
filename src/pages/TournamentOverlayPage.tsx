import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  QueryFieldFilterConstraint,
  where,
} from "firebase/firestore";
import React, {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {RootState} from "../store/store";
import {
  parseAdminMatch
} from "../components/tournamentAdmin/adminMatchFunctions";
import {
  fetchMatchesRequest,
  updateMatch,
} from "../store/tournamentAdmin/reducer";
import TournamentOverlay
  from "../components/tournamentOverlay/tournamentOverlay";
import {normalizeServerMatches} from "../util/overlay";


const TournamentOverlayPage = () => {
  const location = useLocation();
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);
  // Extract the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tournamentSlug = queryParams.get("tournamentId") || "default";
  const courtID = queryParams.get("courtId");
  const noDate = queryParams.get("noDate");


  const dispatch = useDispatch();
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE);

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches.matches);
  const matchesList = useMemo (() => {
    return normalizeServerMatches(Object.values(matches));
  }, [matches]);


  // Fetch the matches when the component mounts
  if (!fetchedMatches && tournamentSlug) {
    dispatch(
        fetchMatchesRequest({tournamentSlug: tournamentSlug, class: null}),
    ); // replace with actual tournamentSlug
    setFetchedMatches(true);
  }


  if (!createdCallbacks && tournamentSlug) {
    const currentDate: string = new Date().toISOString().split("T")[0];
    let collectionQuery: QueryFieldFilterConstraint[] = [];
    if (noDate === null) {
      collectionQuery.push(where("Date", "==", currentDate));
    }
    if (courtID != null) {
      collectionQuery.push(where("Field.Name", "==", courtID));
    }
    //collectionQuery.push(where("HasWinner", "==", false));

    const q = query(
        collection(db, "Tournaments", tournamentSlug, "Matches"),
        ...collectionQuery,
    );

    setCreatedCallbacks(true);
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        let data = change.doc.data();
        if (data) {
          let updatedMatch = parseAdminMatch(data);
          console.log("got update for match %s", updatedMatch.matchId);
          dispatch(
              updateMatch({
                match: updatedMatch,
                matchId: updatedMatch.matchId
              }),
          );
        }
      });
    });
    setCreatedCallbacks(true);
  }

  return <TournamentOverlay matchesList={matchesList} courtID={courtID} />;
}

export default TournamentOverlayPage;
