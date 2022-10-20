import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../BatteryLevel/BatteryLevelStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { usePowerState } from 'react-native-device-info';

const BatteryLevel = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const powerState = usePowerState();
  const batteryLevel = powerState?.batteryLevel * 100;
  const isCharging = powerState?.batteryState === 'charging' ? 'Yes' : 'No';

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
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.dataText}>{'Level: '}</Text>
              <Text
                style={[
                  styles.dataText,
                  styles.dataTextColored,
                ]}>{`${batteryLevel}%`}</Text>
            </View>
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
