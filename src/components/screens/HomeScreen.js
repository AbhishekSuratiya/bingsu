import React from 'react';
import { Button, View } from 'react-native';

const sensors = [
  'accelerometer',
  'gyroscope',
  'magnetometer',
  'barometer',
  'gps',
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
      {sensors.map(sensor => {
        return (
          <Button
            key={sensor}
            title={`Go To ${sensor} Screen`}
            onPress={() =>
              props.navigation.navigate('Sensor', {
                sensorType: sensor,
              })
            }
          />
        );
      })}
    </View>
  );
};

export default HomeScreen;
