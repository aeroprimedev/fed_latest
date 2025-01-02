import { configureStore } from '@reduxjs/toolkit';
import loggedInUserDetailsReducer from './slices/loggedInUserDetailsSlice';
import agentListReducer from './slices/agentListSlice';
import adminListReducer from './slices/adminListSlice';

export const store = configureStore({
  reducer: {
    loggedInUserDetails : loggedInUserDetailsReducer,
    agentList : agentListReducer,
    adminList: adminListReducer
  },
})