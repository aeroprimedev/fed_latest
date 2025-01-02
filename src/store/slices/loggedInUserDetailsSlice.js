import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedInUserDetails: null,
};

export const loggedInUserDetailsSlice = createSlice({
  name: "loggedInUserDetails",
  initialState,
  reducers: {
    updateLoggedInUserDetails: (state, action) => {
      state.loggedInUserDetails = action.payload;
    },
  },
});

export const { updateLoggedInUserDetails } = loggedInUserDetailsSlice.actions;

export default loggedInUserDetailsSlice.reducer;
