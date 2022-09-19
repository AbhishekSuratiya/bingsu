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

    setUpdateIntervalForType(SensorTypes[sensorType], 1000);
    const subscription = sensorMapper[sensorType].subscribe({
      next: data => {
        setSensorData(prev => [...prev, data]);
      },
      error: error => console.log('The sensor is not available', error),
      complete: () => console.log('Completed'),
    });

    setTimeout(() => {
      subscription.unsubscribe();
    }, 300000);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {sensorData.map(data => {
        const { x, y, z } = data;
        return (
          <View key={Math.random()}>
            <Text
              style={{
                color: 'black',
              }}>
              {sensorType === 'barometer'
                ? `Pressure: ${data.pressure}`
                : `x: ${x.toPrecision(4)},    y: ${y.toPrecision(
                    4,
                  )},    z: ${z.toPrecision(4)}`}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default SensorScreen;
