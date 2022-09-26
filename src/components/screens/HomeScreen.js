import React, { useContext, useEffect } from 'react';
import { Button, Platform, View } from 'react-native';
import { AWS_TOPIC_NAME } from '../../utils/contants';
import { AwsContext } from '../../containers/InitialiseAws';

const sensors = [
  'accelerometer',
  'gyroscope',
  'magnetometer',
  'barometer',
  'gps',
  'ambientLight',
  'proximity',
];

const HomeScreen = props => {
  const client = useContext(AwsContext);
  useEffect(() => {
    client &&
      client.publish(
        AWS_TOPIC_NAME,
        JSON.stringify({
          state: {
            reported: {
              AccelerometerXMeasurement: Math.random() + 1,
              AccelerometerYMeasurement: Math.random() + 2,
              AccelerometerZMeasurement: Math.random() + 0.5,
            },
          },
        }),
      );
  }, [client]);

  return (
    <View
      style={{
        paddingVertical: 48,
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1,
      }}>
      {sensors
        .filter(s => (Platform.OS === 'ios' && s === 'ambientLight' ? null : s))
        .map(sensor => {
          return (
            <Button
              key={sensor}
              title={`Go To ${sensor} Screen`}
              onPress={() =>
                props.navigation.navigate('DevSensor', {
                  sensorType: sensor,
                })
              }
            />
          );
        })}
      <Button
        title={'Go To ScanQrScreen Screen'}
        onPress={() => props.navigation.navigate('ScanQr')}
      />
      <Button
        title={'Go To All Sensor Screen'}
        onPress={() => props.navigation.navigate('Sensor')}
      />
    </View>
  );
};

export default HomeScreen;
