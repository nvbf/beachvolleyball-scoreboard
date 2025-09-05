import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  QueryFieldFilterConstraint,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import { parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import {
  fetchMatchesRequest,
  updateMatch,
} from "../store/tournamentAdmin/reducer";
import TournamentOverlay from "../components/tournamentOverlay/tournamentOverlay";
import { normalizeServerMatches } from "../util/overlay";
import { AdminMatch } from "../components/tournamentAdmin/types";

const TournamentOverlayPage = () => {
  const location = useLocation();
  const [fetchedMatches, setFetchedMatches] = useState(false);
  const [createdCallbacks, setCreatedCallbacks] = useState(false);
  // Extract the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tournamentSlug = queryParams.get("tournamentId") || "default";
  const courtID = queryParams.get("courtId");
  const noDate = queryParams.get("noDate");
  const delay = parseInt(queryParams.get("delay") || "0");
  const [visibleMatches, setVisibleMatches] = useState<AdminMatch[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useDispatch();
  let db = getFirestore(import.meta.env.VITE_FIREBASE_DATABASE);

  // Retrieve the matches from the Redux store
  const matches = useSelector((state: RootState) => state.matches.matches);

  // Support delay of score for cameras like Reolink with long delay
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisibleMatches(normalizeServerMatches(Object.values(matches)));
    }, delay);
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [matches, delay]);

  // Fetch the matches when the component mounts
  if (!fetchedMatches && tournamentSlug) {
    dispatch(
      fetchMatchesRequest({ tournamentSlug: tournamentSlug, class: null }),
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
              matchId: updatedMatch.matchId,
            }),
          );
        }
      });
    });
    setCreatedCallbacks(true);
  }

  return <TournamentOverlay matchesList={visibleMatches} courtID={courtID} />;
};

export default TournamentOverlayPage;
