import { withJerseyNumber } from "../src/util/names";

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
