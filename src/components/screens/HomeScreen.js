import React from 'react';
import { Button, Platform, View } from 'react-native';

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
