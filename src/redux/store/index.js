import { configureStore } from '@reduxjs/toolkit';
import awsSlice from '../reducers/awsReducer';
// import {logger} from '../logger';

const store = configureStore({
  reducer: {
    awsStore: awsSlice.reducer,
  },
  // Uncomment this to view redux logs
  // middleware: [logger],
});

export default store;
