import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAltitudeListening: false,
  isGpsListening: false,
  hasLocationPermission: false,
  altitude: [],
  coordinates: {
    latitude: null,
    longitude: null,
  },
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setIsAltitudeListening(state, action) {
      state.isAltitudeListening = action.payload;
    },
    setIsGpsListening(state, action) {
      state.isGpsListening = action.payload;
    },
    setHasLocationPermission(state, action) {
      state.hasLocationPermission = action.payload;
    },
    setAltitude(state, action) {
      state.altitude = [...state.altitude.slice(-20), action.payload];
    },
    setCoordinates(state, action) {
      state.coordinates = action.payload;
    },
  },
});

export const locationAction = locationSlice.actions;
export default locationSlice;
