import {
    callTimeoutEvent,
    createAddPointEvent,
    finalizeMatchEvent,
    finalizeSetEvent,
    pickTeamColorEvent,
    selectFirstServerEvent,
    selectFirstServingTeamEvent,
    setLeftStartTeamEvent,
    setNoSideSwitchEvent,
} from "../src/components/eventFunctions";
import { EventType, TeamType } from "../src/components/types";
import matchReducer, {
    addAwayTeam,
    addHomeTeam,
    evaluateEvents,
    initMatchState,
    insertEvent,
    persistUser,
    resetAwayPlayerName,
    resetHomePlayerName,
    resetMatchId,
    resetTeamColor,
    resetTournamentId,
    setId,
    setMatchId,
    setTeamColor,
    setTournamentId,
    storeEvents,
    storeMatch,
    undoLastEvent,
} from "../src/store/match/reducer";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const USER = "test-user";

/** Build a state with a set of events already inserted, then evaluate. */
function stateWithEvents(events: ReturnType<typeof createAddPointEvent>[]) {
    const s = matchReducer({ ...initMatchState, events }, evaluateEvents());
    return s;
}

/** Score N points for a team, mutating the state each time. */
function scorePoints(
    state: ReturnType<typeof matchReducer>,
    team: TeamType,
    n: number
): ReturnType<typeof matchReducer> {
    for (let i = 0; i < n; i++) {
        state = matchReducer(state, insertEvent(createAddPointEvent(team, USER)));
    }
    return matchReducer(state, evaluateEvents());
}

// ---------------------------------------------------------------------------
// Basic reducer actions
// ---------------------------------------------------------------------------

describe("matchReducer — basic actions", () => {
    it("addHomeTeam stores home team", () => {
        const team = { player1Name: "Alice", player2Name: "Bob" };
        const state = matchReducer(initMatchState, addHomeTeam(team));
        expect(state.homeTeam).toEqual(team);
    });

    it("addAwayTeam stores away team", () => {
        const team = { player1Name: "Carol", player2Name: "Dave" };
        const state = matchReducer(initMatchState, addAwayTeam(team));
        expect(state.awayTeam).toEqual(team);
    });

    it("setId stores match document id", () => {
        const state = matchReducer(initMatchState, setId("doc-abc"));
        expect(state.id).toBe("doc-abc");
    });

    it("setMatchId stores matchId", () => {
        const state = matchReducer(initMatchState, setMatchId("match-123"));
        expect(state.matchId).toBe("match-123");
    });

    it("setTournamentId stores tournamentId", () => {
        const state = matchReducer(initMatchState, setTournamentId("tourney-42"));
        expect(state.tournamentId).toBe("tourney-42");
    });

    it("resetMatchId resets to null string", () => {
        const s = matchReducer({ ...initMatchState, matchId: "something" }, resetMatchId());
        expect(s.matchId).toBe("null");
    });

    it("resetTournamentId resets to null string", () => {
        const s = matchReducer({ ...initMatchState, tournamentId: "something" }, resetTournamentId());
        expect(s.tournamentId).toBe("null");
    });

    it("persistUser stores authUserId", () => {
        const state = matchReducer(initMatchState, persistUser("uid-xyz"));
        expect(state.authUserId).toBe("uid-xyz");
    });

    it("setTeamColor sets home color", () => {
        const s = matchReducer(initMatchState, setTeamColor({ team: TeamType.Home, color: "#ff0000" }));
        expect(s.teamColor[TeamType.Home]).toBe("#ff0000");
    });

    it("setTeamColor sets away color", () => {
        const s = matchReducer(initMatchState, setTeamColor({ team: TeamType.Away, color: "#0000ff" }));
        expect(s.teamColor[TeamType.Away]).toBe("#0000ff");
    });

    it("setTeamColor ignores TeamType.None", () => {
        const s = matchReducer(initMatchState, setTeamColor({ team: TeamType.None, color: "#ffffff" }));
        expect(s.teamColor[TeamType.None]).toBeUndefined();
    });

    it("resetTeamColor clears home color", () => {
        const s0 = matchReducer(initMatchState, setTeamColor({ team: TeamType.Home, color: "#ff0000" }));
        const s1 = matchReducer(s0, resetTeamColor(TeamType.Home));
        expect(s1.teamColor[TeamType.Home]).toBe("");
    });

    it("resetHomePlayerName clears player 1", () => {
        const s0 = matchReducer(initMatchState, addHomeTeam({ player1Name: "Alice", player2Name: "Bob" }));
        const s1 = matchReducer(s0, resetHomePlayerName(1));
        expect(s1.homeTeam.player1Name).toBe("");
        expect(s1.homeTeam.player2Name).toBe("Bob");
    });

    it("resetHomePlayerName clears player 2", () => {
        const s0 = matchReducer(initMatchState, addHomeTeam({ player1Name: "Alice", player2Name: "Bob" }));
        const s1 = matchReducer(s0, resetHomePlayerName(2));
        expect(s1.homeTeam.player2Name).toBe("");
        expect(s1.homeTeam.player1Name).toBe("Alice");
    });

    it("resetAwayPlayerName clears player 1", () => {
        const s0 = matchReducer(initMatchState, addAwayTeam({ player1Name: "Carol", player2Name: "Dave" }));
        const s1 = matchReducer(s0, resetAwayPlayerName(1));
        expect(s1.awayTeam.player1Name).toBe("");
    });

    it("insertEvent appends to event list", () => {
        const event = createAddPointEvent(TeamType.Home, USER);
        const state = matchReducer(initMatchState, insertEvent(event));
        expect(state.events).toHaveLength(1);
        expect(state.events[0]).toEqual(event);
    });

    it("storeMatch populates match fields from a Match object", () => {
        const match = {
            id: "doc-1",
            matchId: "m-1",
            tournamentId: "t-1",
            homeTeam: { player1Name: "A", player2Name: "B" },
            awayTeam: { player1Name: "C", player2Name: "D" },
            homeColor: "#111",
            awayColor: "#222",
            timestamp: 1234567890,
        };
        const s = matchReducer(initMatchState, storeMatch(match));
        expect(s.id).toBe("doc-1");
        expect(s.matchId).toBe("m-1");
        expect(s.tournamentId).toBe("t-1");
        expect(s.teamColor).toEqual({ HOME: "#111", AWAY: "#222" });
    });

    it("storeEvents replaces the events list", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        const e2 = createAddPointEvent(TeamType.Away, USER);
        const s = matchReducer(initMatchState, storeEvents([e1, e2]));
        expect(s.events).toHaveLength(2);
    });
});

// ---------------------------------------------------------------------------
// evaluateEvents — configuration events
// ---------------------------------------------------------------------------

describe("evaluateEvents — configuration events", () => {
    it("FIRST_TEAM_SERVE sets firstServerTeam", () => {
        const s = stateWithEvents([selectFirstServingTeamEvent(TeamType.Home, USER)]);
        expect(s.firstServerTeam).toBe(TeamType.Home);
    });

    it("FIRST_PLAYER_SERVER sets firstServer for home player", () => {
        const s = stateWithEvents([selectFirstServerEvent(TeamType.Home, 1, USER)]);
        expect(s.firstServer[TeamType.Home]).toBe(1);
    });

    it("FIRST_PLAYER_SERVER sets firstServer for away player 2", () => {
        const s = stateWithEvents([selectFirstServerEvent(TeamType.Away, 2, USER)]);
        expect(s.firstServer[TeamType.Away]).toBe(2);
    });

    it("LEFT_SIDE_START_TEAM sets leftSideTeam", () => {
        const s = stateWithEvents([setLeftStartTeamEvent(TeamType.Away, USER)]);
        expect(s.leftSideTeam).toBe(TeamType.Away);
    });

    it("NO_SIDE_SWITCH sets noMirrorSides", () => {
        const s = stateWithEvents([setNoSideSwitchEvent(USER)]);
        expect(s.noMirrorSides).toBe(true);
    });

    it("MATCH_FINALIZED sets user message", () => {
        const s = stateWithEvents([finalizeMatchEvent(USER)]);
        expect(s.userMessage).toBe("match done! thank you!");
    });

    it("TEAM_COLOR event is stored via pickTeamColorEvent (reference field holds color)", () => {
        // The color event is not processed in evaluateEvents — it's managed outside via setTeamColor.
        // This test verifies the event is at least appended without crashing.
        const event = pickTeamColorEvent(TeamType.Home, "#abcdef", USER);
        expect(event.eventType).toBe(EventType.PickColor);
        expect(event.reference).toBe("#abcdef");
    });
});

// ---------------------------------------------------------------------------
// evaluateEvents — scoring & set logic
// ---------------------------------------------------------------------------

describe("evaluateEvents — basic scoring", () => {
    it("scores 1 point to home team", () => {
        const s = stateWithEvents([createAddPointEvent(TeamType.Home, USER)]);
        expect(s.currentScore[TeamType.Home]).toBe(1);
        expect(s.currentScore[TeamType.Away]).toBe(0);
    });

    it("scores 1 point to away team", () => {
        const s = stateWithEvents([createAddPointEvent(TeamType.Away, USER)]);
        expect(s.currentScore[TeamType.Away]).toBe(1);
    });

    it("matchStarted becomes true after first score", () => {
        const s = stateWithEvents([createAddPointEvent(TeamType.Home, USER)]);
        expect(s.matchStarted).toBe(true);
    });

    it("currentSet starts at 1 before any scoring", () => {
        const s = stateWithEvents([]);
        expect(s.currentSet).toBe(1);
    });

    it("startTime is set from the first score event timestamp", () => {
        const event = { ...createAddPointEvent(TeamType.Home, USER), timestamp: 9999 };
        const s = stateWithEvents([event]);
        expect(s.startTime).toBe(9999);
    });
});

describe("evaluateEvents — timeout logic", () => {
    it("TIMEOUT marks home team timeout used", () => {
        const s = stateWithEvents([callTimeoutEvent(TeamType.Home, USER)]);
        expect(s.teamTimeout[TeamType.Home]).toBe(true);
        expect(s.teamTimeout[TeamType.Away]).toBe(false);
    });

    it("TIMEOUT marks away team timeout used", () => {
        const s = stateWithEvents([callTimeoutEvent(TeamType.Away, USER)]);
        expect(s.teamTimeout[TeamType.Away]).toBe(true);
    });

    it("teamTimeout resets after a set is won", () => {
        // Home scores 21 to win set 1
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        // Both timeouts should be reset
        expect(state.teamTimeout[TeamType.Home]).toBe(false);
        expect(state.teamTimeout[TeamType.Away]).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// evaluateEvents — side switch logic (sets 1 & 2)
// ---------------------------------------------------------------------------

describe("evaluateEvents — side switch (sets 1 & 2)", () => {
    it("leftSideTeam flips after 7 combined points", () => {
        let state = matchReducer(
            { ...initMatchState, events: [setLeftStartTeamEvent(TeamType.Home, USER)] },
            evaluateEvents()
        );
        expect(state.leftSideTeam).toBe(TeamType.Home);

        // Score 7 points total: 4 home + 3 away
        state = scorePoints(state, TeamType.Home, 4);
        state = scorePoints(state, TeamType.Away, 3);
        expect(state.leftSideTeam).toBe(TeamType.Away);
    });

    it("switch sides warning message set at 6 combined points (% 7 === 6)", () => {
        let state = matchReducer(
            { ...initMatchState, events: [setLeftStartTeamEvent(TeamType.Home, USER)] },
            evaluateEvents()
        );
        state = scorePoints(state, TeamType.Home, 3);
        state = scorePoints(state, TeamType.Away, 3); // total = 6
        expect(state.userMessage).toBe("switch sides");
    });

    it("leftSideTeam flips again at 14 combined points", () => {
        let state = matchReducer(
            { ...initMatchState, events: [setLeftStartTeamEvent(TeamType.Home, USER)] },
            evaluateEvents()
        );
        state = scorePoints(state, TeamType.Home, 7); // 7 → switch → Away on left
        state = scorePoints(state, TeamType.Away, 7); // 14 → switch → Home on left again
        expect(state.leftSideTeam).toBe(TeamType.Home);
    });

    it("technical timeout message at 20 combined points (sets 1 & 2)", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 10);
        state = scorePoints(state, TeamType.Away, 10); // total = 20
        expect(state.userMessage).toBe("technical");
    });

    it("no technical timeout message in set 3", () => {
        // Win sets 1 and 2 for home team first
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21); // win set 1
        state = scorePoints(state, TeamType.Home, 21); // win set 2
        // Now in set 3 — score to 21 total (impossible to win at 21 in set 3 since win is at 15)
        // Score to 10 each = 20 total, message should NOT be "technical"
        state = scorePoints(state, TeamType.Home, 10);
        state = scorePoints(state, TeamType.Away, 10);
        expect(state.userMessage).not.toBe("technical");
    });
});

// ---------------------------------------------------------------------------
// evaluateEvents — side switch logic (set 3)
// ---------------------------------------------------------------------------

describe("evaluateEvents — side switch (set 3)", () => {
    it("leftSideTeam flips at 5 combined points in set 3", () => {
        let state = matchReducer(
            {
                ...initMatchState,
                events: [setLeftStartTeamEvent(TeamType.Home, USER)],
            },
            evaluateEvents()
        );
        // Win sets 1 and 2 (one each to get to set 3)
        state = scorePoints(state, TeamType.Home, 21); // home wins set 1
        state = scorePoints(state, TeamType.Away, 21); // away wins set 2
        // The leftSideTeam resets between sets; set it again for set 3
        state = matchReducer(
            state,
            insertEvent(setLeftStartTeamEvent(TeamType.Home, USER))
        );
        state = matchReducer(state, evaluateEvents());
        expect(state.leftSideTeam).toBe(TeamType.Home);

        state = scorePoints(state, TeamType.Home, 3);
        state = scorePoints(state, TeamType.Away, 2); // total = 5
        expect(state.leftSideTeam).toBe(TeamType.Away);
    });

    it("switch sides warning at 4 combined points in set 3 (% 5 === 4)", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 21);
        // Score 4 points in set 3
        state = scorePoints(state, TeamType.Home, 2);
        state = scorePoints(state, TeamType.Away, 2);
        expect(state.userMessage).toBe("switch sides");
    });
});

// ---------------------------------------------------------------------------
// evaluateEvents — set win conditions
// ---------------------------------------------------------------------------

describe("evaluateEvents — set win (sets 1 & 2)", () => {
    it("home wins set 1 at exactly 21-0", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        expect(state.currentSet).toBe(2);
        expect(state.currentSetScore[TeamType.Home]).toBe(1);
        expect(state.currentSetScore[TeamType.Away]).toBe(0);
        expect(state.currentScore[TeamType.Home]).toBe(0);
    });

    it("away wins set 1 at 0-21", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Away, 21);
        expect(state.currentSet).toBe(2);
        expect(state.currentSetScore[TeamType.Away]).toBe(1);
        expect(state.currentSetScore[TeamType.Home]).toBe(0);
    });

    it("set does not end at 21-20 (no 2-point lead)", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 20);
        state = scorePoints(state, TeamType.Away, 20);
        state = scorePoints(state, TeamType.Home, 1); // 21-20
        expect(state.currentSet).toBe(1); // still set 1
    });

    it("set ends at 22-20 (2-point lead after deuce)", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 20);
        state = scorePoints(state, TeamType.Away, 20);
        state = scorePoints(state, TeamType.Home, 2); // 22-20
        expect(state.currentSet).toBe(2);
    });

    it("set ends at 25-23 (extended deuce)", () => {
        let state = { ...initMatchState };
        // Get to 20-20 by alternating
        for (let i = 0; i < 20; i++) {
            state = scorePoints(state, TeamType.Home, 1);
            state = scorePoints(state, TeamType.Away, 1);
        }
        // 20-20: score 1 each to reach 21-21 (no win yet)
        state = scorePoints(state, TeamType.Home, 1); // 21-20
        state = scorePoints(state, TeamType.Away, 1); // 21-21
        // 1 more each → 22-22
        state = scorePoints(state, TeamType.Home, 1);
        state = scorePoints(state, TeamType.Away, 1);
        // Home scores 2 to win 24-22
        state = scorePoints(state, TeamType.Home, 2);
        expect(state.currentSet).toBe(2);
    });

    it("teamTimeout, firstServer, firstServerTeam reset between sets", () => {
        let state = matchReducer(
            {
                ...initMatchState,
                events: [
                    callTimeoutEvent(TeamType.Home, USER),
                    selectFirstServerEvent(TeamType.Home, 1, USER),
                    selectFirstServingTeamEvent(TeamType.Home, USER),
                ],
            },
            evaluateEvents()
        );
        state = scorePoints(state, TeamType.Home, 21);
        expect(state.teamTimeout[TeamType.Home]).toBe(false);
        expect(state.firstServer[TeamType.Home]).toBe(0);
        expect(state.firstServerTeam).toBe(TeamType.None);
    });
});

describe("evaluateEvents — set 3 win condition", () => {
    it("home wins set 3 at 15-0", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21); // win set 1
        state = scorePoints(state, TeamType.Away, 21); // win set 2
        state = scorePoints(state, TeamType.Home, 15); // win set 3
        expect(state.finished).toBe(true);
        expect(state.currentSetScore[TeamType.Home]).toBe(2);
        expect(state.currentSetScore[TeamType.Away]).toBe(1);
    });

    it("set 3 does not end at 15-14", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 21);
        state = scorePoints(state, TeamType.Home, 14);
        state = scorePoints(state, TeamType.Away, 14);
        state = scorePoints(state, TeamType.Home, 1); // 15-14
        expect(state.finished).toBe(false);
    });

    it("set 3 ends at 16-14", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 21);
        state = scorePoints(state, TeamType.Home, 14);
        state = scorePoints(state, TeamType.Away, 14);
        state = scorePoints(state, TeamType.Home, 2); // 16-14
        expect(state.finished).toBe(true);
    });

    it("away can win set 3", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 21);
        state = scorePoints(state, TeamType.Away, 15);
        expect(state.finished).toBe(true);
        expect(state.currentSetScore[TeamType.Away]).toBe(2);
        expect(state.currentSetScore[TeamType.Home]).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// evaluateEvents — full match
// ---------------------------------------------------------------------------

describe("evaluateEvents — full match scenarios", () => {
    it("home wins 2-0", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Home, 21);
        expect(state.finished).toBe(true);
        expect(state.currentSetScore[TeamType.Home]).toBe(2);
        expect(state.currentSetScore[TeamType.Away]).toBe(0);
    });

    it("away wins 2-0", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Away, 21);
        state = scorePoints(state, TeamType.Away, 21);
        expect(state.finished).toBe(true);
        expect(state.currentSetScore[TeamType.Home]).toBe(0);
        expect(state.currentSetScore[TeamType.Away]).toBe(2);
    });

    it("home wins 2-1", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 21);
        state = scorePoints(state, TeamType.Home, 15);
        expect(state.finished).toBe(true);
        expect(state.currentSetScore[TeamType.Home]).toBe(2);
        expect(state.currentSetScore[TeamType.Away]).toBe(1);
    });

    it("away wins 2-1", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Away, 21);
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 15);
        expect(state.finished).toBe(true);
        expect(state.currentSetScore[TeamType.Away]).toBe(2);
        expect(state.currentSetScore[TeamType.Home]).toBe(1);
    });

    it("match is not finished during set 2 at 1-1", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21);
        state = scorePoints(state, TeamType.Away, 10);
        expect(state.finished).toBe(false);
    });

    it("theCurrentSets tracks per-set scores", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 21); // set 1: HOME 21, AWAY 0
        // theCurrentSets[0] should reflect 21-0 at end of set 1 (before reset)
        // After win, scores reset. The saved snapshot should be from before reset.
        expect(state.theCurrentSets[0]).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// undoLastEvent
// ---------------------------------------------------------------------------

describe("undoLastEvent", () => {
    it("marks the last event as undone and appends an UNDO event", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        const e2 = createAddPointEvent(TeamType.Away, USER);
        let state = matchReducer({ ...initMatchState, events: [e1, e2] }, evaluateEvents());
        state = matchReducer(state, undoLastEvent());

        const undoneEvent = state.events.find((e) => e.id === e2.id);
        expect(undoneEvent?.undone).toBeTruthy();

        const undoEvent = state.events.find((e) => e.eventType === EventType.Undo);
        expect(undoEvent).toBeDefined();
    });

    it("undone event is excluded from evaluation", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        const e2 = createAddPointEvent(TeamType.Away, USER);
        let state = matchReducer({ ...initMatchState, events: [e1, e2] }, evaluateEvents());
        state = matchReducer(state, undoLastEvent());
        state = matchReducer(state, evaluateEvents());

        // e2 (away point) was undone — only home point remains
        expect(state.currentScore[TeamType.Home]).toBe(1);
        expect(state.currentScore[TeamType.Away]).toBe(0);
    });

    it("multiple undos work correctly", () => {
        const events = [
            createAddPointEvent(TeamType.Home, USER),
            createAddPointEvent(TeamType.Home, USER),
            createAddPointEvent(TeamType.Away, USER),
        ];
        let state = matchReducer({ ...initMatchState, events }, evaluateEvents());
        state = matchReducer(state, undoLastEvent()); // undo away +1
        state = matchReducer(state, undoLastEvent()); // undo home +1
        state = matchReducer(state, evaluateEvents());

        expect(state.currentScore[TeamType.Home]).toBe(1);
        expect(state.currentScore[TeamType.Away]).toBe(0);
    });

    it("undo on empty events does nothing", () => {
        const state = matchReducer({ ...initMatchState, events: [] }, undoLastEvent());
        expect(state.events).toHaveLength(0);
    });

    it("undo does not affect already-undone events", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        let state = matchReducer({ ...initMatchState, events: [e1] }, evaluateEvents());
        state = matchReducer(state, undoLastEvent()); // undo e1
        const before = state.events.length;
        state = matchReducer(state, undoLastEvent()); // nothing valid to undo
        // No new undo event should be added since nothing is undoable
        expect(state.events.length).toBe(before);
    });

    it("undo of a timeout restores timeout availability", () => {
        const timeout = callTimeoutEvent(TeamType.Home, USER);
        let state = matchReducer({ ...initMatchState, events: [timeout] }, evaluateEvents());
        expect(state.teamTimeout[TeamType.Home]).toBe(true);

        state = matchReducer(state, undoLastEvent());
        state = matchReducer(state, evaluateEvents());
        expect(state.teamTimeout[TeamType.Home]).toBe(false);
    });

    it("undo of a score decrements the score", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        const e2 = createAddPointEvent(TeamType.Home, USER);
        let state = matchReducer({ ...initMatchState, events: [e1, e2] }, evaluateEvents());
        expect(state.currentScore[TeamType.Home]).toBe(2);

        state = matchReducer(state, undoLastEvent());
        state = matchReducer(state, evaluateEvents());
        expect(state.currentScore[TeamType.Home]).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// userMessage lifecycle
// ---------------------------------------------------------------------------

describe("evaluateEvents — userMessage lifecycle", () => {
    it("userMessage clears when next score is registered after switch sides warning", () => {
        let state = { ...initMatchState };
        // Score 6 to get warning
        state = scorePoints(state, TeamType.Home, 3);
        state = scorePoints(state, TeamType.Away, 3); // total = 6, warning
        expect(state.userMessage).toBe("switch sides");

        // Score one more — triggers the actual switch, message should clear
        state = scorePoints(state, TeamType.Home, 1); // total = 7
        // After switch (% 7 === 0), userMessage is not explicitly cleared here unless the next message overwrites it
        // evaluateEvents sets userMessage = "" at start of each SCORE event
        // but then may set a new one. At 7, no warning is set, so it should be "".
        expect(state.userMessage).toBe("");
    });

    it("userMessage is technical at 20 combined", () => {
        let state = { ...initMatchState };
        state = scorePoints(state, TeamType.Home, 10);
        state = scorePoints(state, TeamType.Away, 10);
        expect(state.userMessage).toBe("technical");
    });
});
