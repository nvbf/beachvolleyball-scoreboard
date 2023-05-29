import { createSlice } from "@reduxjs/toolkit";

const initState = {
  tournamentName: "loool",
  profixioslugID: 0,
};

export const createTournamentSlice = createSlice({
  name: "createTournament",
  initialState: { initState },
  reducers: {
    addTournamentName(state, action) {
      state.initState = action.payload;
    },
  },
});

export const createTournamentAction = createTournamentSlice.actions;
export default createTournamentSlice.reducer;
