import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../BatteryLevel/BatteryLevelStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import DeviceInfo from 'react-native-device-info/src/index';

const BatteryLevel = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    DeviceInfo.getBatteryLevel().then(level => {
      console.log({ level });
      setBatteryLevel(level * 100);
    });
    DeviceInfo.isBatteryCharging().then(state => {
      setIsCharging(state);
    });
  }, []);

  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{'Battery'}</Text>
            <Switch
              trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
              thumbColor={Colors.white100}
              onValueChange={() => {
                setIsSensorListening(val => !val);
              }}
              value={isSensorListening}
            />
          </View>

          <View>
            <Text style={styles.dataText}>{`Level: ${batteryLevel}%`}</Text>
            <Text style={styles.dataText}>{`Charging: ${
              isCharging ? 'Yes' : 'No'
            }`}</Text>
          </View>

          <View style={styles.batteryLevelWrapper}>
            <View
              style={[
                styles.batteryLevel,
                {
                  width: `${batteryLevel}%`,
                },
              ]}
            />
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default BatteryLevel;
