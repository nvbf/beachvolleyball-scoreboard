import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";
import { TeamType } from "../src/components/types";
import {
    createAddPointEvent,
} from "../src/components/eventFunctions";
import {
    evaluateEvents,
    initMatchState,
    insertEvent,
    persistUser,
    publishScores,
    storeEvents,
    storeMatch,
    undoLastEvent,
} from "../src/store/match/reducer";
import {
    authorizeFirestore,
    finalizeEndedMatch,
    getOldEvents,
    getOldMatch,
    pushNewEvent,
    publishScoresToTournaments,
    undoGivenEvent,
} from "../src/store/match/sagas";
import {
    addEventToMatchToFirestore,
    getEventsFromMatch,
    getMatch,
    setMatchFinalized,
    setMatchResult,
    setScoreboardScore,
    setStartTime,
} from "../src/firebase/match_service";
import { matchState } from "../src/store/types";


// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({
        currentUser: { uid: "test-uid-123" },
    })),
}));

vi.mock("../src/firebase/firebase-config", () => ({
    db: {},
    auth: {},
}));

vi.mock("../src/firebase/match_service", () => ({
    addEventToMatchToFirestore: vi.fn(),
    getEventsFromMatch: vi.fn(),
    getMatch: vi.fn(),
    initNewMatch: vi.fn(),
    setMatchFinalized: vi.fn(),
    setMatchResult: vi.fn(),
    setScoreboardId: vi.fn(),
    setScoreboardScore: vi.fn(),
    setStartTime: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const USER_ID = "test-uid-123";

const makeEventPayload = (team = TeamType.Home) => ({
    matchId: "match-1",
    id: "doc-1",
    event: createAddPointEvent(team, USER_ID),
});

const makeUndoPayload = () => ({
    matchId: "match-1",
    id: "doc-1",
    event: {
        id: "undo-id",
        eventType: "UNDO" as any,
        team: TeamType.None,
        playerId: 0,
        timestamp: Date.now(),
        undone: "",
        author: USER_ID,
        reference: "ref-event-id",
    },
});

const sampleMatch = {
    id: "doc-1",
    matchId: "m-1",
    tournamentId: "t-1",
    homeTeam: { player1Name: "A", player2Name: "B" },
    awayTeam: { player1Name: "C", player2Name: "D" },
    homeColor: "#111",
    awayColor: "#222",
    timestamp: 1000,
};

// ---------------------------------------------------------------------------
// pushNewEvent saga
// ---------------------------------------------------------------------------

describe("pushNewEvent saga", () => {
    it("inserts the event, evaluates, calls Firestore, then publishes scores", () => {
        const payload = makeEventPayload();
        return expectSaga(pushNewEvent, { type: "addEvent", payload })
            .provide([
                [matchers.call.fn(addEventToMatchToFirestore), "firestore-doc-id"],
            ])
            .put(insertEvent(payload.event))
            .put(evaluateEvents())
            .call(addEventToMatchToFirestore, payload.id, payload.event)
            .put(publishScores())
            .run();
    });

    it("handles Firestore errors gracefully (does not throw)", () => {
        const payload = makeEventPayload();
        return expectSaga(pushNewEvent, { type: "addEvent", payload })
            .provide([
                [matchers.call.fn(addEventToMatchToFirestore), throwError(new Error("Firestore down"))],
            ])
            .put(insertEvent(payload.event))
            .put(evaluateEvents())
            .run();
    });

    it("works for away team events too", () => {
        const payload = makeEventPayload(TeamType.Away);
        return expectSaga(pushNewEvent, { type: "addEvent", payload })
            .provide([
                [matchers.call.fn(addEventToMatchToFirestore), "doc-id"],
            ])
            .put(insertEvent(payload.event))
            .put(evaluateEvents())
            .run();
    });
});

// ---------------------------------------------------------------------------
// getOldEvents saga
// ---------------------------------------------------------------------------

describe("getOldEvents saga", () => {
    const events = [
        createAddPointEvent(TeamType.Home, USER_ID),
        createAddPointEvent(TeamType.Away, USER_ID),
    ];

    it("fetches events from Firestore, stores them, then evaluates", () => {
        return expectSaga(getOldEvents, { type: "checkDb", payload: "doc-1" })
            .provide([
                [matchers.call.fn(getEventsFromMatch), events],
            ])
            .call(getEventsFromMatch, "doc-1")
            .put(storeEvents(events))
            .put(evaluateEvents())
            .run();
    });

    it("handles fetch errors gracefully", () => {
        return expectSaga(getOldEvents, { type: "checkDb", payload: "doc-1" })
            .provide([
                [matchers.call.fn(getEventsFromMatch), throwError(new Error("Network error"))],
            ])
            .run();
    });
});

// ---------------------------------------------------------------------------
// getOldMatch saga
// ---------------------------------------------------------------------------

describe("getOldMatch saga", () => {
    it("fetches the match and dispatches storeMatch", () => {
        return expectSaga(getOldMatch, { type: "checkDb", payload: "doc-1" })
            .provide([
                [matchers.call.fn(getMatch), sampleMatch],
            ])
            .call(getMatch, "doc-1")
            .put(storeMatch(sampleMatch))
            .run();
    });

    it("handles fetch errors gracefully", () => {
        return expectSaga(getOldMatch, { type: "checkDb", payload: "doc-1" })
            .provide([
                [matchers.call.fn(getMatch), throwError(new Error("Not found"))],
            ])
            .run();
    });
});

// ---------------------------------------------------------------------------
// undoGivenEvent saga
// ---------------------------------------------------------------------------

describe("undoGivenEvent saga", () => {
    it("dispatches undoLastEvent, evaluateEvents, then calls Firestore", () => {
        const payload = makeUndoPayload();
        return expectSaga(undoGivenEvent, { type: "undoEvent", payload })
            .provide([
                [matchers.call.fn(addEventToMatchToFirestore), "undo-doc-id"],
            ])
            .put(undoLastEvent())
            .put(evaluateEvents())
            .call(addEventToMatchToFirestore, payload.id, payload.event)
            .run();
    });

    it("handles Firestore errors gracefully", () => {
        const payload = makeUndoPayload();
        return expectSaga(undoGivenEvent, { type: "undoEvent", payload })
            .provide([
                [matchers.call.fn(addEventToMatchToFirestore), throwError(new Error("Write failed"))],
            ])
            .put(undoLastEvent())
            .put(evaluateEvents())
            .run();
    });
});

// ---------------------------------------------------------------------------
// authorizeFirestore saga
// ---------------------------------------------------------------------------

describe("authorizeFirestore saga", () => {
    it("dispatches persistUser with the current user uid", () => {
        return expectSaga(authorizeFirestore, { type: "authorize", payload: undefined })
            .put(persistUser(USER_ID))
            .run();
    });
});

// ---------------------------------------------------------------------------
// publishScoresToTournaments saga
// ---------------------------------------------------------------------------

describe("publishScoresToTournaments saga", () => {
    const matchStateWith1Point: matchState = {
        ...initMatchState,
        tournamentId: "t-1",
        matchId: "m-1",
        currentSet: 1,
        currentScore: { HOME: 1, AWAY: 0 },
        theCurrentSets: [{ HOME: 1, AWAY: 0 }],
        currentSetScore: { HOME: 0, AWAY: 0 },
        startTime: 5000,
    };

    // The saga uses select(getSomePartOfState) which reads state.match.
    // withState provides the full Redux state shape to make the selector work.
    const reduxState = { match: matchStateWith1Point };

    it("calls setScoreboardScore with current match state", () => {
        return expectSaga(publishScoresToTournaments, { type: "publishScores", payload: undefined })
            .withState(reduxState)
            .provide([
                [matchers.call.fn(setScoreboardScore), undefined],
                [matchers.call.fn(setStartTime), undefined],
            ])
            .call(
                setScoreboardScore,
                matchStateWith1Point.tournamentId,
                matchStateWith1Point.matchId,
                matchStateWith1Point.theCurrentSets,
                matchStateWith1Point.currentSetScore
            )
            .run();
    });

    it("calls setStartTime on the very first point of the match (set 1, total = 1)", () => {
        return expectSaga(publishScoresToTournaments, { type: "publishScores", payload: undefined })
            .withState(reduxState)
            .provide([
                [matchers.call.fn(setScoreboardScore), undefined],
                [matchers.call.fn(setStartTime), undefined],
            ])
            .call(setStartTime, "t-1", "m-1", matchStateWith1Point.startTime)
            .run();
    });

    it("does NOT call setStartTime after the first point", () => {
        const later: matchState = {
            ...matchStateWith1Point,
            currentScore: { HOME: 5, AWAY: 3 },
        };
        return expectSaga(publishScoresToTournaments, { type: "publishScores", payload: undefined })
            .withState({ match: later })
            .provide([
                [matchers.call.fn(setScoreboardScore), undefined],
            ])
            .not.call.fn(setStartTime)
            .run();
    });

    it("handles errors gracefully", () => {
        return expectSaga(publishScoresToTournaments, { type: "publishScores", payload: undefined })
            .withState(reduxState)
            .provide([
                [matchers.call.fn(setScoreboardScore), throwError(new Error("Publish failed"))],
            ])
            .run();
    });
});

// ---------------------------------------------------------------------------
// finalizeEndedMatch saga
// ---------------------------------------------------------------------------

describe("finalizeEndedMatch saga", () => {
    const finishedState: matchState = {
        ...initMatchState,
        tournamentId: "t-1",
        matchId: "m-1",
        id: "doc-1",
        finished: true,
    };

    it("calls setMatchFinalized and setMatchResult", () => {
        return expectSaga(finalizeEndedMatch, { type: "finalizeMatch", payload: undefined })
            .withState({ match: finishedState })
            .provide([
                [matchers.call.fn(setMatchFinalized), undefined],
                [matchers.call.fn(setMatchResult), undefined],
            ])
            .call(setMatchFinalized, finishedState.tournamentId, finishedState.matchId)
            .call(setMatchResult, finishedState.id)
            .run();
    });

    it("handles errors gracefully", () => {
        return expectSaga(finalizeEndedMatch, { type: "finalizeMatch", payload: undefined })
            .withState({ match: finishedState })
            .provide([
                [matchers.call.fn(setMatchFinalized), throwError(new Error("Finalize failed"))],
            ])
            .run();
    });
});
