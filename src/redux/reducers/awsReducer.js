import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAwsConnected: false,
  awsRegion: '',
  cognitoIdentityPool: '',
  roleArn: '',
  qrData: {},
  isScanning: false,
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
    setRoleArn(state, action) {
      state.roleArn = action.payload;
    },
    setQrData(state, action) {
      state.qrData = action.payload;
    },
    setIsScanning(state, action) {
      state.isScanning = action.payload;
    },
  },
});

export const awsAction = awsSlice.actions;
export default awsSlice;
