import tournamentReducer, { createTournamentAction } from "../src/store/tournament/reducer";

const { addTournamentName } = createTournamentAction;

describe("tournament reducer", () => {
    it("has correct initial state shape", () => {
        const state = tournamentReducer(undefined, { type: "@@INIT" });
        expect(state).toHaveProperty("initState");
        expect(state.initState).toHaveProperty("tournamentName");
        expect(state.initState).toHaveProperty("profixioslugID");
    });

    it("addTournamentName replaces the tournament name state", () => {
        const initial = tournamentReducer(undefined, { type: "@@INIT" });
        const payload = { tournamentName: "Summer Cup 2026", profixioslugID: 42 };
        const state = tournamentReducer(initial, addTournamentName(payload));
        expect(state.initState).toEqual(payload);
    });

    it("addTournamentName overwrites the previous value", () => {
        let state = tournamentReducer(undefined, { type: "@@INIT" });
        state = tournamentReducer(state, addTournamentName({ tournamentName: "First", profixioslugID: 1 }));
        state = tournamentReducer(state, addTournamentName({ tournamentName: "Second", profixioslugID: 2 }));
        expect(state.initState.tournamentName).toBe("Second");
        expect(state.initState.profixioslugID).toBe(2);
    });

    it("unknown action does not mutate state", () => {
        const initial = tournamentReducer(undefined, { type: "@@INIT" });
        const state = tournamentReducer(initial, { type: "UNKNOWN_ACTION" });
        expect(state).toEqual(initial);
    });
});
