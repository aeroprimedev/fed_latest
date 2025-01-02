import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminList: null,
};

export const adminListSlice = createSlice({
  name: "adminList",
  initialState,
  reducers: {
    updateAdminList: (state, action) => {
      state.adminList = action.payload;
    },
  },
});

export const { updateAdminList } = adminListSlice.actions;

export default adminListSlice.reducer;
