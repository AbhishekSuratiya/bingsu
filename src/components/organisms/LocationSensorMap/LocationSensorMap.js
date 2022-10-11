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
import getCommandEntry from '../../../utils/getCommandEntry';
import { locationAction } from '../../../redux/reducers/locationReducer';

const LocationSensorMap = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);
  const dispatch = useDispatch();
  const { coordinates, isGpsListening } = useSelector(
    state => state.locationStore,
  );

  useEffect(() => {
    if (isAwsConnected && isGpsListening) {
      const command = new BatchPutAssetPropertyValueCommand({
        entries: [
          getCommandEntry({
            entryId: 'AssetModelGPSLatMeasurement',
            propertyAlias: qrData.AssetModelGPSLatMeasurement,
            value: coordinates.latitude,
          }),
          getCommandEntry({
            entryId: 'AssetModelGPSGPSLongMeasurement',
            propertyAlias: qrData.AssetModelGPSGPSLongMeasurement,
            value: coordinates.longitude,
          }),
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
    } else {
      stopGps();
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
                {`Latitude: ${coordinates.latitude}\nLongitude: ${coordinates.longitude}`}
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
        {isSensorListening && <MapView style={styles.map} showsUserLocation />}
      </Collapsible>
    </View>
  );
};

export default LocationSensorMap;
