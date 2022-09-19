import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  accelerometer,
  gyroscope,
  magnetometer,
  barometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import GetLocation from 'react-native-get-location';

const sensorMapper = {
  accelerometer,
  gyroscope,
  magnetometer,
  barometer,
};

const SensorScreen = ({ route, navigation }) => {
  const [sensorData, setSensorData] = useState([]);
  const { sensorType } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: route.params.sensorType.toUpperCase() });

    if (sensorType !== 'gps') {
      setUpdateIntervalForType(SensorTypes[sensorType], 1000);
      const subscription = sensorMapper[sensorType].subscribe({
        next: data => {
          setSensorData(prev => [...prev, data]);
        },
        error: error => console.log('The sensor is not available', error),
        complete: () => console.log('Completed'),
      });
      return () => subscription.unsubscribe();
    } else {
      const interval = setInterval(() => {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location => setSensorData(prev => [...prev, location]))
          .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
          });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  const getDataText = data => {
    if (sensorType === 'barometer') {
      return `Pressure: ${data.pressure}`;
    } else if (sensorType === 'gps') {
      return `Altitude: ${data.altitude},    Latitude: ${data.latitude},    longitude: ${data.longitude}`;
    } else {
      return `x: ${data.x.toPrecision(4)},    y: ${data.y.toPrecision(
        4,
      )},    z: ${data.z.toPrecision(4)}`;
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {sensorData.map(data => {
        return (
          <View key={Math.random()} style={{ borderBottomWidth: 1 }}>
            <Text style={{ color: 'black' }}>{getDataText(data)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default SensorScreen;
