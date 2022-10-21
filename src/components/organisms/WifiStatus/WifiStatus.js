import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../WifiStatus/WifiStatusStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { useNetInfo } from '@react-native-community/netinfo';

const WifiStatus = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [strength, setStrength] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    setIsConnected(netInfo?.type === 'wifi' ? 'Yes' : 'No');
    setStrength(netInfo?.details?.strength || 0);
  }, [netInfo]);

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
            <Text
              style={styles.dataText}>{`Wifi connected: ${isConnected}`}</Text>
            <Text
              style={styles.dataText}>{`Signal strength: ${strength}%`}</Text>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default WifiStatus;
