import { tournamentAdminSagas } from "../src/store/tournamentAdmin/saga";
import {
    fetchMatchesRequest,
    fetchMatchSecrets,
} from "../src/store/tournamentAdmin/reducer";

// NOTE: The individual worker functions (fetchMatchesFromFirestore,
// fetchDatesFromFirestore, fetchArenaNamesFromFirestore,
// fetchClassesFromFirestore, getMatcheSecretFromFirestore) are not
// exported from the saga module. Their business-logic outcomes are
// covered by the tournamentAdmin-reducer tests. The tests here verify
// the watcher setup — that the correct actions trigger the correct
// number of workers — using synchronous generator stepping.

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

import { AllEffect, ForkEffect } from "redux-saga/effects";

/** Run the watcher generator one step and return the first yielded ALL effect. */
function getWatcherAllEffect() {
    const gen = tournamentAdminSagas();
    const { value, done } = gen.next();
    return { value: value as AllEffect<ForkEffect<never>>, done };
}

// ---------------------------------------------------------------------------
// Watcher structure
// ---------------------------------------------------------------------------

describe("tournamentAdminSagas — watcher structure", () => {
    it("is a generator function", () => {
        expect(tournamentAdminSagas.constructor.name).toBe("GeneratorFunction");
    });

    it("yields an ALL combinator effect on the first step", () => {
        const { value, done } = getWatcherAllEffect();
        expect(done).toBe(false);
        expect(value).toMatchObject({
            "@@redux-saga/IO": true,
            combinator: true,
            type: "ALL",
        });
    });

    it("the ALL effect contains exactly 5 FORK watchers", () => {
        const { value } = getWatcherAllEffect();
        const payload = value.payload as any[];
        expect(Array.isArray(payload)).toBe(true);
        expect(payload).toHaveLength(5);
        payload.forEach((effect: any) => {
            expect(effect).toMatchObject({
                "@@redux-saga/IO": true,
                combinator: false,
                type: "FORK",
            });
        });
    });

    it("generator is done after the ALL effect", () => {
        const gen = tournamentAdminSagas();
        gen.next(); // consume the ALL effect
        const { done } = gen.next();
        expect(done).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// Watched action types — fetchMatchesRequest triggers 4 workers
// ---------------------------------------------------------------------------

describe("tournamentAdminSagas — fetchMatchesRequest action type", () => {
    function getWatchedTypes() {
        const { value } = getWatcherAllEffect();
        return (value.payload as any[]).map((effect) => effect.payload.args[0]);
    }

    it("4 of the 5 watchers listen on fetchMatchesRequest", () => {
        const types = getWatchedTypes();
        const count = types.filter((t) => t === fetchMatchesRequest.type).length;
        expect(count).toBe(4);
    });

    it("1 of the 5 watchers listens on fetchMatchSecrets", () => {
        const types = getWatchedTypes();
        const count = types.filter((t) => t === fetchMatchSecrets.type).length;
        expect(count).toBe(1);
    });

    it("no other action types are watched", () => {
        const types = getWatchedTypes();
        const knownTypes = [fetchMatchesRequest.type, fetchMatchSecrets.type];
        types.forEach((t) => expect(knownTypes).toContain(t));
    });
});
