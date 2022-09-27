import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAwsConnected: false,
  awsRegion: '',
  cognitoIdentityPool: '',
};

const awsSlice = createSlice({
  name: 'aws',
  initialState,
  reducers: {
    setIsAwsConnected(state, action) {
      state.isAwsConnected = action.payload;
    },
    setAwsRegion(state, action) {
      state.awsRegion = action.payload;
    },
    setCognitoIdentityPool(state, action) {
      state.cognitoIdentityPool = action.payload;
    },
  },
});

export const awsAction = awsSlice.actions;
export default awsSlice;
