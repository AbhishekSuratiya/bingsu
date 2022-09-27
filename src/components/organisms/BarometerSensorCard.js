import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from './BarometerSensorCardStyles';
import Collapsible from 'react-native-collapsible';
import Colors from '../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../utils/contants';

const BarometerSensorCard = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);

  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Switch
              trackColor={{ false: '#787880', true: Colors.blue }}
              thumbColor={Colors.white100}
              onValueChange={() => setIsSensorListening(val => !val)}
              value={isSensorListening}
            />
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default BarometerSensorCard;
