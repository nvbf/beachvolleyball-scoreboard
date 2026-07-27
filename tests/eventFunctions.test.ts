import {
    callTimeoutEvent,
    createAddPointEvent,
    createCommentEvent,
    createUndoEvent,
    getLastValidEvent,
} from "../src/components/eventFunctions";
import { TeamType } from "../src/components/types";

const USER = "test-user";

describe("getLastValidEvent", () => {
    it("returns null for an empty event list", () => {
        expect(getLastValidEvent([])).toBeNull();
    });

    it("returns the most recent event", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        const e2 = callTimeoutEvent(TeamType.Away, USER);
        expect(getLastValidEvent([e1, e2])).toEqual(e2);
    });

    it("skips a trailing UNDO event and returns the event before it", () => {
        const timeout = callTimeoutEvent(TeamType.Home, USER);
        const undo = createUndoEvent([timeout], USER);
        expect(getLastValidEvent([timeout, undo])).toEqual(timeout);
    });

    it("skips a trailing COMMENT event and returns the event before it", () => {
        const timeout = callTimeoutEvent(TeamType.Home, USER);
        const comment = createCommentEvent("note", USER);
        expect(getLastValidEvent([timeout, comment])).toEqual(timeout);
    });

    it("skips an already-undone event", () => {
        const e1 = createAddPointEvent(TeamType.Home, USER);
        const e2 = { ...createAddPointEvent(TeamType.Away, USER), undone: "some-undo-id" };
        expect(getLastValidEvent([e1, e2])).toEqual(e1);
    });

    it("returns null when only COMMENT/UNDO/undone events exist", () => {
        const comment = createCommentEvent("note", USER);
        const undo = createUndoEvent([], USER);
        expect(getLastValidEvent([comment, undo])).toBeNull();
    });
});
