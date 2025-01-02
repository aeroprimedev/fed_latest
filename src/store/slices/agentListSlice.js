import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agentList: null,
};

export const agentListSlice = createSlice({
  name: "agentList",
  initialState,
  reducers: {
    updateAgentList: (state, action) => {
      state.agentList = action.payload;
    },
  },
});

export const { updateAgentList } = agentListSlice.actions;

export default agentListSlice.reducer;
