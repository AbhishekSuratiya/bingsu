import { configureStore } from '@reduxjs/toolkit';
import awsSlice from '../reducers/awsReducer';
import locationSlice from '../reducers/locationReducer';
// import {logger} from '../logger';

const store = configureStore({
  reducer: {
    awsStore: awsSlice.reducer,
    locationStore: locationSlice.reducer,
  },
  // Uncomment this to view redux logs
  // middleware: [logger],
});

export default store;
