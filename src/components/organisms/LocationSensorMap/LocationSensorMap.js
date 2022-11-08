import React, { useContext, useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from './LocationSensorMapStyles';
import Collapsible from 'react-native-collapsible';
import Colors from '../../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import MapView from 'react-native-maps';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { useDispatch, useSelector } from 'react-redux';
import { AwsContext } from '../../../containers/InitialiseAws';
import { locationAction } from '../../../redux/reducers/locationReducer';
import { LoggerContext } from '../../../containers/Logger';

const LocationSensorMap = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);
  const dispatch = useDispatch();
  const {
    coordinates,
    isGpsListening,
    hasLocationPermission,
    checkingForPermission,
  } = useSelector(state => state.locationStore);
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    if (
      isAwsConnected &&
      isGpsListening &&
      coordinates.latitude &&
      coordinates.longitude
    ) {
      const command = new BatchPutAssetPropertyValueCommand({
        entries: [
          {
            entryId: 'AssetModelGPSLatMeasurement',
            propertyAlias:
              ASSET_MODEL_MEASUREMENTS_PREFIX + 'GPSLatMeasurement',
            propertyValues: [
              {
                value: {
                  stringValue: coordinates.latitude.toFixed(6),
                },
                timestamp: { timeInSeconds: Date.now() / 1000 },
              },
            ],
          },
          {
            entryId: 'AssetModelGPSLongMeasurement',
            propertyAlias:
              ASSET_MODEL_MEASUREMENTS_PREFIX + 'GPSLongMeasurement',
            propertyValues: [
              {
                value: {
                  stringValue: coordinates.latitude.toFixed(6),
                },
                timestamp: { timeInSeconds: Date.now() / 1000 },
              },
            ],
          },
        ],
      });
      client?.send(command);
    }
  }, [coordinates, isAwsConnected, isGpsListening]);

  const startGps = () => {
    dispatch(locationAction.setIsGpsListening(true));
  };

  const stopGps = () => {
    dispatch(locationAction.setIsGpsListening(false));
  };

  useEffect(() => {
    if (!hasLocationPermission && !checkingForPermission) {
      setIsSensorListening(false);
    }
  }, [checkingForPermission]);

  useEffect(() => {
    if (isSensorListening) {
      stopGps();
      startGps();
    } else {
      startGps();
      stopGps();
    }
  }, [isAwsConnected]);

  useEffect(() => {
    if (isSensorListening) {
      startGps();
      cloudWatchLog(`${title} started`);
    } else {
      stopGps();
      cloudWatchLog(`${title} stopped`);
    }
    return stopGps;
  }, [isSensorListening]);
  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View
          style={[
            styles.header,
            isSensorListening && { height: SENSOR_CARD_HEADER + 16 },
          ]}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {isSensorListening && (
              <Text style={styles.currentValue}>
                {`Latitude: ${
                  coordinates.latitude?.toFixed(6) || 0
                }\nLongitude: ${coordinates.longitude?.toFixed(6) || 0}`}
              </Text>
            )}
          </View>
          <Switch
            trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
            thumbColor={Colors.white100}
            onValueChange={() => setIsSensorListening(val => !val)}
            value={isSensorListening}
          />
        </View>
        {isSensorListening && (
          <MapView style={styles.map} showsUserLocation followsUserLocation />
        )}
      </Collapsible>
    </View>
  );
};

export default LocationSensorMap;
