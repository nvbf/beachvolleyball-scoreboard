import adminReducer, {
    addSecrets,
    chooseCourt,
    chooseDay,
    fetchMatchClassesSuccess,
    fetchMatchDatesSuccess,
    fetchMatchFieldsSuccess,
    fetchMatchesFailure,
    fetchMatchesSuccess,
    setLoader,
    updateMatch,
} from "../src/store/tournamentAdmin/reducer";
import { AdminMatch, MatchState } from "../src/components/tournamentAdmin/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeAdminMatch = (overrides: Partial<AdminMatch> = {}): AdminMatch => ({
    matchId: 1,
    awayTeam: { isWinner: false, name: "Away Team", player1: "A1", player2: "A2" },
    homeTeam: { isWinner: false, name: "Home Team", player1: "H1", player2: "H2" },
    currentScore: [{ HOME: 0, AWAY: 0 }],
    currentSetScore: { HOME: 0, AWAY: 0 },
    sets: [],
    startTime: 1000,
    startTimestamp: 0,
    arenaName: "Field 1",
    hasWinner: false,
    isFinalized: false,
    isStarted: false,
    referee: "",
    matchCategory: "MH",
    matchGroup: "Group A",
    name: "Match 1",
    scoreboardID: "sb-1",
    ...overrides,
});

const initState = adminReducer(undefined, { type: "@@INIT" });

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — initial state", () => {
    it("has empty matches object", () => {
        expect(initState.matches).toEqual({});
    });

    it("has showLoader true by default", () => {
        expect(initState.showLoader).toBe(true);
    });

    it("has selectedDay 'all'", () => {
        expect(initState.selectedDay).toBe("all");
    });

    it("has selectedCourt 'all'", () => {
        expect(initState.selectedCourt).toBe("all");
    });

    it("has empty errorMessage", () => {
        expect(initState.errorMessage).toBe("");
    });
});

// ---------------------------------------------------------------------------
// fetchMatchesSuccess
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — fetchMatchesSuccess", () => {
    it("converts matches array to an object keyed by matchId", () => {
        const match1 = makeAdminMatch({ matchId: 10 });
        const match2 = makeAdminMatch({ matchId: 20 });
        const state = adminReducer(initState, fetchMatchesSuccess({ matches: [match1, match2] }));
        expect(state.matches[10]).toEqual(match1);
        expect(state.matches[20]).toEqual(match2);
    });

    it("overwrites existing matches on re-fetch", () => {
        const original = makeAdminMatch({ matchId: 10, arenaName: "Old Field" });
        const updated = makeAdminMatch({ matchId: 10, arenaName: "New Field" });
        let state = adminReducer(initState, fetchMatchesSuccess({ matches: [original] }));
        state = adminReducer(state, fetchMatchesSuccess({ matches: [updated] }));
        expect(state.matches[10].arenaName).toBe("New Field");
    });

    it("handles empty matches array", () => {
        const state = adminReducer(initState, fetchMatchesSuccess({ matches: [] }));
        expect(state.matches).toEqual({});
    });

    it("preserves all AdminMatch fields", () => {
        const match = makeAdminMatch({ matchId: 5, referee: "Ref Jones", matchCategory: "WH" });
        const state = adminReducer(initState, fetchMatchesSuccess({ matches: [match] }));
        expect(state.matches[5].referee).toBe("Ref Jones");
        expect(state.matches[5].matchCategory).toBe("WH");
    });
});

// ---------------------------------------------------------------------------
// fetchMatchesFailure
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — fetchMatchesFailure", () => {
    it("stores the error message", () => {
        const state = adminReducer(initState, fetchMatchesFailure("Network error"));
        expect(state.errorMessage).toBe("Network error");
    });

    it("overwrites a previous error message", () => {
        let state = adminReducer(initState, fetchMatchesFailure("First error"));
        state = adminReducer(state, fetchMatchesFailure("Second error"));
        expect(state.errorMessage).toBe("Second error");
    });
});

// ---------------------------------------------------------------------------
// updateMatch
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — updateMatch", () => {
    it("updates a single match by matchId", () => {
        const original = makeAdminMatch({ matchId: 7, arenaName: "Field A" });
        let state = adminReducer(initState, fetchMatchesSuccess({ matches: [original] }));

        const updated = makeAdminMatch({ matchId: 7, arenaName: "Field B", isStarted: true });
        state = adminReducer(state, updateMatch({ matchId: 7, match: updated }));
        expect(state.matches[7].arenaName).toBe("Field B");
        expect(state.matches[7].isStarted).toBe(true);
    });

    it("does not affect other matches", () => {
        const m1 = makeAdminMatch({ matchId: 1 });
        const m2 = makeAdminMatch({ matchId: 2 });
        let state = adminReducer(initState, fetchMatchesSuccess({ matches: [m1, m2] }));

        const updatedM1 = makeAdminMatch({ matchId: 1, arenaName: "Changed" });
        state = adminReducer(state, updateMatch({ matchId: 1, match: updatedM1 }));
        expect(state.matches[2]).toEqual(m2);
    });

    it("can add a new match that was not in the initial fetch", () => {
        const newMatch = makeAdminMatch({ matchId: 99 });
        const state = adminReducer(initState, updateMatch({ matchId: 99, match: newMatch }));
        expect(state.matches[99]).toEqual(newMatch);
    });
});

// ---------------------------------------------------------------------------
// chooseCourt / chooseDay
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — chooseCourt", () => {
    it("sets selectedCourt", () => {
        const state = adminReducer(initState, chooseCourt("Field 3"));
        expect(state.selectedCourt).toBe("Field 3");
    });

    it("overwrites previous selection", () => {
        let state = adminReducer(initState, chooseCourt("Field 1"));
        state = adminReducer(state, chooseCourt("Field 2"));
        expect(state.selectedCourt).toBe("Field 2");
    });
});

describe("tournamentAdmin reducer — chooseDay", () => {
    it("sets selectedDay", () => {
        const state = adminReducer(initState, chooseDay("2026-04-02"));
        expect(state.selectedDay).toBe("2026-04-02");
    });

    it("'all' is a valid day selection", () => {
        let state = adminReducer(initState, chooseDay("2026-04-02"));
        state = adminReducer(state, chooseDay("all"));
        expect(state.selectedDay).toBe("all");
    });
});

// ---------------------------------------------------------------------------
// addSecrets
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — addSecrets", () => {
    it("stores secret and id, and hides loader", () => {
        const state = adminReducer(initState, addSecrets({ id: "tourney-abc", secret: "super-secret" }));
        expect(state.secret).toBe("super-secret");
        expect(state.id).toBe("tourney-abc");
        expect(state.showLoader).toBe(false);
    });

    it("overwrites previous secrets", () => {
        let state = adminReducer(initState, addSecrets({ id: "old-id", secret: "old-secret" }));
        state = adminReducer(state, addSecrets({ id: "new-id", secret: "new-secret" }));
        expect(state.id).toBe("new-id");
        expect(state.secret).toBe("new-secret");
    });
});

// ---------------------------------------------------------------------------
// setLoader
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — setLoader", () => {
    it("sets showLoader to false", () => {
        const state = adminReducer(initState, setLoader(false));
        expect(state.showLoader).toBe(false);
    });

    it("sets showLoader to true", () => {
        let state = adminReducer(initState, setLoader(false));
        state = adminReducer(state, setLoader(true));
        expect(state.showLoader).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// fetchMatchDatesSuccess
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — fetchMatchDatesSuccess", () => {
    it("stores the dates array", () => {
        const dates = ["2026-04-01", "2026-04-02", "2026-04-03"];
        const state = adminReducer(initState, fetchMatchDatesSuccess(dates));
        expect(state.dates).toEqual(dates);
    });

    it("auto-selects today if today is in the dates list", () => {
        const today = new Date().toISOString().split("T")[0];
        const dates = ["2026-01-01", today, "2099-12-31"];
        const state = adminReducer(initState, fetchMatchDatesSuccess(dates));
        expect(state.selectedDay).toBe(today);
    });

    it("selects 'all' if today is not in the dates list", () => {
        const dates = ["2020-01-01", "2020-01-02"];
        const state = adminReducer(initState, fetchMatchDatesSuccess(dates));
        expect(state.selectedDay).toBe("all");
    });

    it("handles empty dates array without error", () => {
        const state = adminReducer(initState, fetchMatchDatesSuccess([]));
        expect(state.dates).toEqual([]);
        expect(state.selectedDay).toBe("all");
    });
});

// ---------------------------------------------------------------------------
// fetchMatchFieldsSuccess
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — fetchMatchFieldsSuccess", () => {
    it("stores the fields array", () => {
        const fields = ["Field 1", "Field 2", "Main Arena"];
        const state = adminReducer(initState, fetchMatchFieldsSuccess(fields));
        expect(state.fields).toEqual(fields);
    });

    it("handles empty fields array", () => {
        const state = adminReducer(initState, fetchMatchFieldsSuccess([]));
        expect(state.fields).toEqual([]);
    });

    it("overwrites previous fields", () => {
        let state = adminReducer(initState, fetchMatchFieldsSuccess(["Old Field"]));
        state = adminReducer(state, fetchMatchFieldsSuccess(["New Field A", "New Field B"]));
        expect(state.fields).toEqual(["New Field A", "New Field B"]);
    });
});

// ---------------------------------------------------------------------------
// fetchMatchClassesSuccess
// ---------------------------------------------------------------------------

describe("tournamentAdmin reducer — fetchMatchClassesSuccess", () => {
    it("stores the classes array", () => {
        const classes = ["MH", "WH", "MX"];
        const state = adminReducer(initState, fetchMatchClassesSuccess(classes));
        expect(state.classes).toEqual(classes);
    });

    it("handles empty classes array", () => {
        const state = adminReducer(initState, fetchMatchClassesSuccess([]));
        expect(state.classes).toEqual([]);
    });
});
