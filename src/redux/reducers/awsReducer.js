import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAwsConnected: false,
  awsRegion: '',
  cognitoIdentityPool: '',
  roleArn: '',
  qrData: {},
  isScanning: false,
  sessionToken: '',
  secretAccessKey: '',
  accessKeyId: '',
  isConnecting: false,
  showValidatedAnimation: false,
  isLoggingEnabled: true,
  logStreamName: '',
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
    setIsConnecting(state, action) {
      state.isConnecting = action.payload;
    },
    setAccessKeyId(state, action) {
      state.accessKeyId = action.payload;
    },
    setSessionToken(state, action) {
      state.sessionToken = action.payload;
    },
    setSecretAccessKey(state, action) {
      state.secretAccessKey = action.payload;
    },
    setShowValidatedAnimation(state, action) {
      state.showValidatedAnimation = action.payload;
    },
    setLoggingEnabled(state, action) {
      state.isLoggingEnabled = action.payload;
    },
    setLogStreamName(state, action) {
      state.logStreamName = action.payload;
    },
  },
});

export const awsAction = awsSlice.actions;
export default awsSlice;
