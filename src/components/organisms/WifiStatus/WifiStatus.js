import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../WifiStatus/WifiStatusStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { useNetInfo } from '@react-native-community/netinfo';

const WifiStatus = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const netInfo = useNetInfo();

  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{'Wifi'}</Text>
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
            <Text style={styles.dataText}>{`Connected: ${
              netInfo?.isConnected ? 'Yes' : 'No'
            }`}</Text>
            <Text style={styles.dataText}>{`Signal strength: ${
              netInfo?.details?.strength || 0
            }%`}</Text>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default WifiStatus;
