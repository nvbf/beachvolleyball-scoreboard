import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeamType, EventType, Event, Team, Match } from "../../components/types"
import { matchState } from "../types"
import { v4 } from 'uuid';

export interface AddEventPayload {
  matchId: string;
  id: string;
  event: Event;
}

export interface AddTeamColorPayload {
  team: TeamType;
  color: string;
}

export const initMatchState: matchState = {
  homeTeam: {
    player1Name: "",
    player2Name: "",
  },
  awayTeam: {
    player1Name: "",
    player2Name: "",
  },
  teamColor: { "HOME": "", "AWAY": "" },
  matchId: "null",
  tournamentId: "null",
  id: "",
  finished: false,
  technicalTimeout: false,
  technicalTimeoutStart: 0,
  switchSide: false,
  noMirrorSides: false,
  matchStarted: false,
  startTime: 0,
  userMessage: "",
  firstServer: { "HOME": 0, "AWAY": 0 },
  firstServerTeam: TeamType.None,
  leftSideTeam: TeamType.None,
  currentSet: 0,
  theCurrentSets: [],
  currentSetScore: { "HOME": 0, "AWAY": 0 },
  currentScore: { "HOME": 0, "AWAY": 0 },
  teamTimeout: { "HOME": false, "AWAY": false },
  events: [],
  shouldUpdate: false,
  errorMessage: "",
}

const matchSlice = createSlice({
  name: 'admin',
  initialState: initMatchState,
  reducers: {
    addHomeTeam: (state, action: PayloadAction<Team>) => {
      state.homeTeam = action.payload
    },
    addAwayTeam: (state, action: PayloadAction<Team>) => {
      state.awayTeam = action.payload
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
    setMatchId: (state, action: PayloadAction<string>) => {
      state.matchId = action.payload
    },
    setTournamentId: (state, action: PayloadAction<string>) => {
      state.tournamentId = action.payload;
    },
    resetMatchId: (state) => {
      state.matchId = "null";
    },
    resetTournamentId: (state) => {
      state.tournamentId = "null";
    },
    resetHomePlayerName: (state, action: PayloadAction<number>) => {
      if (action.payload === 1) {
        state.homeTeam.player1Name = "";
      } else {
        state.homeTeam.player2Name = "";
      }
    },
    resetAwayPlayerName: (state, action: PayloadAction<number>) => {
      if (action.payload === 1) {
        state.awayTeam.player1Name = "";
      } else {
        state.awayTeam.player2Name = "";
      }
    },
    resetTeamColor: (state, action: PayloadAction<TeamType>) => {
      if (action.payload != TeamType.None) {
        state.teamColor[action.payload] = "";
      }
    },
    setTeamColor: (state, action: PayloadAction<AddTeamColorPayload>) => {
      if (action.payload.team != TeamType.None) {
        state.teamColor[action.payload.team] = action.payload.color;
      }
    },
    insertEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    undoLastEvent: (state) => {
      const { events } = state;
      const reversedEvents = [...events].reverse();
      const undoneEventIndex = reversedEvents.findIndex((event: Event) => !event.undone && event.eventType !== EventType.Undo);
      if (undoneEventIndex < 0) {
        return state;
      }
      const actualIndex = undoneEventIndex >= 0 ? events.length - 1 - undoneEventIndex : -1;

      const undoneEvent: Event = events[actualIndex];
      const undoId = v4();
      const updatedEvents = [
        ...events.slice(0, actualIndex),
        { ...undoneEvent, undone: undoId },
        ...events.slice(actualIndex + 1, events.length),
        {
          id: undoId,
          eventType: EventType.Undo,
          team: undoneEvent.team,
          playerId: undoneEvent.playerId,
          timestamp: Date.now(),
          undone: "",
          author: "",
          reference: undoneEvent.id,
        }
      ];
      state.events = updatedEvents
    },
    evaluateEvents: (state) => {
      const { events } = state;
      const sets: { [key: string]: number } = { [TeamType.Home]: 0, [TeamType.Away]: 0 };
      let homeSetScore = [0, 0, 0];
      let awaySetScore = [0, 0, 0];
      let currentSet = 1;
      let teamTimeout = { "HOME": false, "AWAY": false };
      let firstServer = { "HOME": 0, "AWAY": 0 };
      let firstServerTeam = TeamType.None;
      let leftSideTeam = TeamType.None;
      let noMirrorSides = false;
      let matchStarted = false;
      let matchStartTime = 0;
      let userMessage = "";
      let technicalTimeoutStart = 0;
      let theCurrentSets: { [key: string]: number }[] = state.theCurrentSets.slice()
      events.forEach((event: Event) => {
        if (event.undone) {
          return;
        }
        if (event.eventType === EventType.Score) {
          userMessage = "";
          if (!matchStarted) {
            matchStarted = true
          }
          if (matchStartTime === 0) {
            matchStartTime = event.timestamp
          }
          const setIndex = currentSet - 1;
          if (event.team === TeamType.Home) {
            homeSetScore[setIndex] += 1;
          } else {
            awaySetScore[setIndex] += 1;
          }
          theCurrentSets[currentSet - 1] = { "HOME": homeSetScore[currentSet - 1], "AWAY": awaySetScore[currentSet - 1] }
          if (currentSet === 1 || currentSet === 2) {
            if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 7 === 0) {
              if (leftSideTeam === TeamType.Home) {
                leftSideTeam = TeamType.Away
              } else {
                leftSideTeam = TeamType.Home
              }
            }
            if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 7 === 6) {
              userMessage = "switch sides"
            }
            if ((homeSetScore[setIndex] + awaySetScore[setIndex]) === 20) {
              userMessage = "technical"
            }
            if (homeSetScore[setIndex] >= 21 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
              sets[TeamType.Home] += 1;
              teamTimeout = { "HOME": false, "AWAY": false }
              firstServer = { "HOME": 0, "AWAY": 0 }
              firstServerTeam = TeamType.None;
              leftSideTeam = TeamType.None;
              homeSetScore[setIndex] = 0;
              awaySetScore[setIndex] = 0;
              currentSet += 1;
              userMessage = "";
            } else if (awaySetScore[setIndex] >= 21 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
              sets[TeamType.Away] += 1;
              teamTimeout = { "HOME": false, "AWAY": false }
              firstServer = { "HOME": 0, "AWAY": 0 }
              firstServerTeam = TeamType.None;
              leftSideTeam = TeamType.None;
              homeSetScore[setIndex] = 0;
              awaySetScore[setIndex] = 0;
              currentSet += 1;
              userMessage = "";
            }
          } else {
            if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 5 === 0) {
              if (leftSideTeam === TeamType.Home) {
                leftSideTeam = TeamType.Away
              } else {
                leftSideTeam = TeamType.Home
              }
            }
            if ((homeSetScore[setIndex] + awaySetScore[setIndex]) % 5 === 4) {
              userMessage = "switch sides"
            }
            if (homeSetScore[setIndex] >= 15 && homeSetScore[setIndex] - awaySetScore[setIndex] >= 2) {
              sets[TeamType.Home] += 1;
              homeSetScore[setIndex] = 0;
              awaySetScore[setIndex] = 0;
              userMessage = "";
            } else if (awaySetScore[setIndex] >= 15 && awaySetScore[setIndex] - homeSetScore[setIndex] >= 2) {
              sets[TeamType.Away] += 1;
              homeSetScore[setIndex] = 0;
              awaySetScore[setIndex] = 0;
              userMessage = "";
            }
          }
        } else if (event.eventType === EventType.Timeout && event.team !== TeamType.None) {
          teamTimeout[event.team] = true
        } else if (event.eventType === EventType.FirstPlayerServer && event.team !== TeamType.None) {
          firstServer[event.team] = event.playerId
        } else if (event.eventType === EventType.FirstTeamServer && event.team !== TeamType.None) {
          firstServerTeam = event.team
        } else if (event.eventType === EventType.LeftSideStartTeam && event.team !== TeamType.None) {
          leftSideTeam = event.team
        } else if (event.eventType === EventType.NoSideSwitch) {
          noMirrorSides = true
        } else if (event.eventType === EventType.MatchFinalized) {
          userMessage = "match done! thank you!"
        }
      });
      const currentSetScore = {
        [TeamType.Home]: homeSetScore[currentSet - 1],
        [TeamType.Away]: awaySetScore[currentSet - 1],
      };
      let matchDone = sets[TeamType.Home] === 2 || sets[TeamType.Away] === 2;
      state.currentScore = currentSetScore;
      state.currentSet = currentSet;
      state.firstServer = firstServer;
      state.firstServerTeam = firstServerTeam;
      state.teamTimeout = teamTimeout;
      state.finished = matchDone;
      state.leftSideTeam = leftSideTeam;
      state.matchStarted = matchStarted;
      state.noMirrorSides = noMirrorSides;
      state.startTime = matchStartTime;
      state.userMessage = userMessage;
      state.technicalTimeoutStart = technicalTimeoutStart;
      state.currentSetScore = sets;
      state.theCurrentSets = theCurrentSets;
    },

    storeEvents: (state, action: PayloadAction<Event[]>) => {
      console.log("In reducer store events");

      state.events = action.payload;
    },

    storeMatch: (state, action: PayloadAction<Match>) => {
      console.log("In reducer store match");

      state.id = action.payload.id;
      state.matchId = action.payload.matchId;
      state.tournamentId = action.payload.tournamentId;
      state.homeTeam = action.payload.homeTeam;
      state.awayTeam = action.payload.awayTeam;
      state.teamColor = { "HOME": action.payload.homeColor, "AWAY": action.payload.awayColor };
      state.startTime = action.payload.timestamp;

    },
    checkDb: (state, action: PayloadAction<string>) => { }, // dummy reducer
    publishScores: (state) => { }, // dummy reducer
    finalizeMatch: (state) => { }, // dummy reducer
    finalizeSet: (state) => { }, // dummy reducer
    updateScores: (state, action: PayloadAction<TeamType>) => { }, // dummy reducer
    addTeamError: (state, action: PayloadAction<Error>) => { }, // dummy reducer
    addEvent: (state, action: PayloadAction<AddEventPayload>) => { }, // dummy reducer
    undoEvent: (state, action: PayloadAction<AddEventPayload>) => { }, // dummy reducer
    noMirrorSides: (state) => { }, // dummy reducer
    teamStartLeft: (state, action: PayloadAction<TeamType>) => { }, // dummy reducer
    initMatch: (state, action: PayloadAction<Match>) => { }, // dummy reducer
  }
});

export const {
  storeEvents,
  storeMatch,
  setMatchId,
  setTournamentId,
  setId,
  addHomeTeam,
  addAwayTeam,
  setTeamColor,
  insertEvent,
  undoLastEvent,
  evaluateEvents,
  resetMatchId,
  resetTournamentId,
  resetTeamColor,
  resetHomePlayerName,
  resetAwayPlayerName,
  checkDb,
  publishScores,
  finalizeMatch,
  finalizeSet,
  updateScores,
  addTeamError,
  addEvent,
  undoEvent,
  noMirrorSides,
  teamStartLeft,
  initMatch,
} = matchSlice.actions;

export default matchSlice.reducer;

