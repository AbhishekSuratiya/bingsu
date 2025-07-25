import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { locationAction } from '../../redux/reducers/locationReducer';
import { useContext, useEffect, useRef } from 'react';
import { LoggerContext } from '../../containers/Logger';

const LocationManager = () => {
  const subscriptionLocation = useRef(null);
  const dispatch = useDispatch();
  const { isAltitudeListening, isGpsListening } = useSelector(
    state => state.locationStore,
  );
  const cloudWatchLog = useContext(LoggerContext);
  const requestLocationPermission = async () => {
    dispatch(locationAction.setCheckingForPermission(true));
    if (Platform.OS === 'android') {
      try {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        dispatch(
          locationAction.setHasLocationPermission(response === 'granted'),
        );
        if (response === 'granted') {
          cloudWatchLog('Location access granted');
        } else {
          cloudWatchLog('Location access denied');
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      const response = await Geolocation.requestAuthorization('whenInUse');
      dispatch(locationAction.setHasLocationPermission(response === 'granted'));
      if (response === 'granted') {
        cloudWatchLog('Location access granted');
      } else {
        cloudWatchLog('Location access denied');
      }
    }
    dispatch(locationAction.setCheckingForPermission(false));
  };

  const startLocation = () => {
    subscriptionLocation.current = Geolocation.watchPosition(
      ({ coords: { latitude, longitude, altitude } }) => {
        dispatch(locationAction.setAltitude(altitude));
        dispatch(locationAction.setCoordinates({ latitude, longitude }));
      },
      error => {
        console.log(error.code, error.message);
        Geolocation.stopObserving();
      },
      { enableHighAccuracy: true, interval: 1000, distanceFilter: 1 },
    );
  };

  const stopLocation = () => {
    Geolocation.clearWatch(subscriptionLocation.current);
  };

  const startLocationService = async () => {
    await requestLocationPermission();
    startLocation();
  };

  useEffect(() => {
    if (isAltitudeListening || isGpsListening) {
      startLocationService();
    }
    if (!isAltitudeListening && !isGpsListening) {
      stopLocation();
    }
  }, [isAltitudeListening, isGpsListening]);
};

export default LocationManager;
