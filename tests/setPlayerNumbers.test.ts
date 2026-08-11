import { jerseyPickDisabled } from "../src/components/scoreboard/setPlayerNumbers";
import { TeamType } from "../src/components/types";
import { initMatchState } from "../src/store/match/reducer";

describe("jerseyPickDisabled", () => {
    it("is not disabled when no jersey number has been picked for the team", () => {
        const state = { ...initMatchState, jerseyNumberOne: { [TeamType.Home]: 0, [TeamType.Away]: 0 } };
        expect(jerseyPickDisabled(state, TeamType.Home)).toBe(false);
        expect(jerseyPickDisabled(state, TeamType.Away)).toBe(false);
    });

    it("is disabled for the home team once a home pick has been made", () => {
        const state = { ...initMatchState, jerseyNumberOne: { [TeamType.Home]: 1, [TeamType.Away]: 0 } };
        expect(jerseyPickDisabled(state, TeamType.Home)).toBe(true);
        expect(jerseyPickDisabled(state, TeamType.Away)).toBe(false);
    });

    it("is disabled for the away team once an away pick has been made", () => {
        const state = { ...initMatchState, jerseyNumberOne: { [TeamType.Home]: 0, [TeamType.Away]: 2 } };
        expect(jerseyPickDisabled(state, TeamType.Home)).toBe(false);
        expect(jerseyPickDisabled(state, TeamType.Away)).toBe(true);
    });

    it("stays disabled regardless of which player (1 or 2) was picked", () => {
        const pickedPlayer1 = { ...initMatchState, jerseyNumberOne: { [TeamType.Home]: 1, [TeamType.Away]: 0 } };
        const pickedPlayer2 = { ...initMatchState, jerseyNumberOne: { [TeamType.Home]: 2, [TeamType.Away]: 0 } };
        expect(jerseyPickDisabled(pickedPlayer1, TeamType.Home)).toBe(true);
        expect(jerseyPickDisabled(pickedPlayer2, TeamType.Home)).toBe(true);
    });
});
