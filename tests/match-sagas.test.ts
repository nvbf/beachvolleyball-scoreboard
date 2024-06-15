import { callTimeoutEvent, createAddPointEvent, finalizeMatchEvent, setLeftStartTeamEvent } from "../src/components/eventFunctions";
import { TeamType } from "../src/components/types";
import { addAwayTeam, addEvent, addHomeTeam, evaluateEvents, insertEvent, setId, setMatchId } from "../src/store/match/reducer";
import matchReducer, { initMatchState } from "../src/store/match/reducer";


describe('match reducer', () => {

    it('should handle ADD_HOME_TEAM', () => {
        const initialState = {
            ...initMatchState,
            //... rest of your initial state
        };

        const homeTeam = {
            player1Name: 'Player 1',
            player2Name: 'Player 2',
        };

        const state = matchReducer(initialState, addHomeTeam(homeTeam));
        expect(state.homeTeam).toEqual(homeTeam);
    });

    it('should handle ADD_AWAY_TEAM', () => {
        const initialState = {
            ...initMatchState,
            //... rest of your initial state
        };

        const awayTeam = {
            player1Name: 'Player 1',
            player2Name: 'Player 2',
        };

        const state = matchReducer(initialState, addAwayTeam(awayTeam));
        expect(state.awayTeam).toEqual(awayTeam);
    });

    it('should handle SET_ID', () => {
        const initialState = {
            ...initMatchState,
            //... rest of your initial state
        };

        const id = '1234';

        const state = matchReducer(initialState, setId(id));
        expect(state.id).toEqual(id);
    });

    it('should handle SET_MATCH_ID', () => {
        const initialState = {
            ...initMatchState,
            //... rest of your initial state
        };
        const matchId = '1234';

        const state = matchReducer(initialState, setMatchId(matchId));

        expect(state.matchId).toEqual(matchId);
    });

    it('should correctly handle scoring events', () => {
        const initialState = {
            ...initMatchState,
            events: [
                setLeftStartTeamEvent(TeamType.Home, initMatchState.authUserId),
                createAddPointEvent(TeamType.Home, initMatchState.authUserId),
                createAddPointEvent(TeamType.Away, initMatchState.authUserId),
                createAddPointEvent(TeamType.Home, initMatchState.authUserId),
                createAddPointEvent(TeamType.Away, initMatchState.authUserId),
                createAddPointEvent(TeamType.Away, initMatchState.authUserId),
                createAddPointEvent(TeamType.Home, initMatchState.authUserId),
            ],
        };
        let state = matchReducer(initialState, evaluateEvents());
        expect(state.currentScore[TeamType.Home]).toEqual(3);
        expect(state.currentScore[TeamType.Away]).toEqual(3);
        expect(state.leftSideTeam).toEqual(TeamType.Home);
        expect(state.currentSet).toEqual(1);
        state = matchReducer(state, insertEvent(createAddPointEvent(TeamType.Home, initMatchState.authUserId)));
        state = matchReducer(state, evaluateEvents());
        expect(state.currentScore[TeamType.Home]).toEqual(4);
        expect(state.currentScore[TeamType.Away]).toEqual(3);
        expect(state.leftSideTeam).toEqual(TeamType.Away);
        for (let i = 0; i < 20; i++) {
            state = matchReducer(state, insertEvent(createAddPointEvent(TeamType.Away, initMatchState.authUserId)));
            state = matchReducer(state, insertEvent(createAddPointEvent(TeamType.Home, initMatchState.authUserId)));
        }
        state = matchReducer(state, evaluateEvents());
        expect(state.currentScore[TeamType.Home]).toEqual(24);
        expect(state.currentScore[TeamType.Away]).toEqual(23);
        expect(state.leftSideTeam).toEqual(TeamType.Home);
        state = matchReducer(state, insertEvent(createAddPointEvent(TeamType.Home, initMatchState.authUserId)));
        state = matchReducer(state, evaluateEvents());
        expect(state.currentSet).toEqual(2);
        expect(state.currentScore[TeamType.Home]).toEqual(0);
        expect(state.currentScore[TeamType.Away]).toEqual(0);
        expect(state.currentSetScore[TeamType.Home]).toEqual(1);
        expect(state.currentSetScore[TeamType.Away]).toEqual(0);
        expect(state.finished).toEqual(false);
        for (let i = 0; i < 21; i++) {
            state = matchReducer(state, insertEvent(createAddPointEvent(TeamType.Home, initMatchState.authUserId)));
        }
        state = matchReducer(state, evaluateEvents());
        expect(state.currentSet).toEqual(3);
        expect(state.currentScore[TeamType.Home]).toEqual(0);
        expect(state.currentScore[TeamType.Away]).toEqual(0);
        expect(state.currentSetScore[TeamType.Home]).toEqual(2);
        expect(state.currentSetScore[TeamType.Away]).toEqual(0);
        expect(state.finished).toEqual(true);

    });

    it('should correctly handle timeout events', () => {
        const initialState = {
            ...initMatchState,
            events: [
                callTimeoutEvent(TeamType.Home, initMatchState.authUserId),
            ],
        };
        const state = matchReducer(initialState, evaluateEvents());
        expect(state.teamTimeout[TeamType.Home]).toEqual(true);
    });

    it('should correctly handle MatchFinalized events', () => {
        const initialState = {
            ...initMatchState,
            events: [
                finalizeMatchEvent(initMatchState.authUserId),
            ],
        };
        const state = matchReducer(initialState, evaluateEvents());
        expect(state.userMessage).toEqual('match done! thank you!');
        // Continue checking the rest of the state properties...
    });
});
