import { jerseyNumberFor, withJerseyNumber } from "../src/util/names";

describe("withJerseyNumber", () => {
    it("prefixes the label with the jersey number when present", () => {
        expect(withJerseyNumber("J. Doe", "7")).toBe("#7 J. Doe");
    });

    it("returns the label unchanged when jersey number is undefined", () => {
        expect(withJerseyNumber("J. Doe", undefined)).toBe("J. Doe");
    });

    it("returns the label unchanged when jersey number is an empty string", () => {
        expect(withJerseyNumber("J. Doe", "")).toBe("J. Doe");
    });
});

describe("jerseyNumberFor", () => {
    it("returns undefined when no player has been picked for the team", () => {
        expect(jerseyNumberFor(0, 1)).toBeUndefined();
        expect(jerseyNumberFor(0, 2)).toBeUndefined();
    });

    it("returns \"1\" for the picked player when player 1 wears #1", () => {
        expect(jerseyNumberFor(1, 1)).toBe("1");
    });

    it("returns \"2\" for the other player when player 1 wears #1", () => {
        expect(jerseyNumberFor(1, 2)).toBe("2");
    });

    it("returns \"1\" for the picked player when player 2 wears #1", () => {
        expect(jerseyNumberFor(2, 2)).toBe("1");
    });

    it("returns \"2\" for the other player when player 2 wears #1", () => {
        expect(jerseyNumberFor(2, 1)).toBe("2");
    });
});
