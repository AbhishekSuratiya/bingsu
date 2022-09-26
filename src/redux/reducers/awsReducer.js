import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAwsConnected: false,
};

const awsSlice = createSlice({
  name: 'aws',
  initialState,
  reducers: {
    setIsAwsConnected(state, action) {
      state.isAwsConnected = action.payload;
    },
  },
});

export const awsAction = awsSlice.actions;
export default awsSlice;
