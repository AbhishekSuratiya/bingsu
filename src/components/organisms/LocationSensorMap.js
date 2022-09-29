import React, { useContext, useEffect, useRef, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from './LocationSensorMapStyles';
import Collapsible from 'react-native-collapsible';
import Colors from '../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../utils/contants';
import MapView from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { useSelector } from 'react-redux';
import { AwsContext } from '../../containers/InitialiseAws';

const LocationSensorMap = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const subscriptionGps = useRef(null);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);

  const startGps = () => {
    subscriptionGps.current = setInterval(() => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      })
        .then(({ latitude, longitude }) => {
          setCurrentLocation({ latitude, longitude });
          if (isAwsConnected) {
            const command = new BatchPutAssetPropertyValueCommand({
              entries: [
                {
                  entryId: 'AssetModelGPSLatMeasurement',
                  propertyAlias: qrData.AssetModelGPSLatMeasurement,
                  propertyValues: [
                    {
                      value: { doubleValue: latitude },
                      timestamp: { timeInSeconds: Date.now() / 1000 },
                    },
                  ],
                },
                {
                  entryId: 'AssetModelGPSGPSLongMeasurement',
                  propertyAlias: qrData.AssetModelGPSGPSLongMeasurement,
                  propertyValues: [
                    {
                      value: { doubleValue: longitude },
                      timestamp: { timeInSeconds: Date.now() / 1000 },
                    },
                  ],
                },
              ],
            });
            client?.send(command);
          }
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        });
    }, 1000);
  };

  const stopGps = () => {
    clearInterval(subscriptionGps.current);
  };

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
                {`Latitude: ${currentLocation.latitude}\nLongitude: ${currentLocation.longitude}`}
              </Text>
            )}
          </View>
          <Switch
            trackColor={{ false: '#787880', true: Colors.blue }}
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
