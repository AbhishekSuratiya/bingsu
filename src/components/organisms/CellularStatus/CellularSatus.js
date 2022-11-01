import React, { useContext, useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../CellularStatus/CellularSatusStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import * as NetInfo from '@react-native-community/netinfo';
import { LoggerContext } from '../../../containers/Logger';

const CellularStatus = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [generation, setGeneration] = useState('');
  const netInfo = useNetInfo();
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    NetInfo.fetch('cellular').then(state => {
      setCarrier(state?.details?.carrier);
      setGeneration(state?.details?.cellularGeneration || 'Connected to Wifi');
    });
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
            <Text style={styles.title}>{'Cellular details'}</Text>
            <Switch
              trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
              thumbColor={Colors.white100}
              onValueChange={() => {
                if (isSensorListening) {
                  cloudWatchLog('Cellular status monitoring stopped');
                } else {
                  cloudWatchLog('Cellular status monitoring started');
                }
                setIsSensorListening(val => !val);
              }}
              value={isSensorListening}
            />
          </View>

          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.dataText}>{'Carrier: '}</Text>
              <Text style={[styles.dataText, styles.dataTextColored]}>
                {carrier}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.dataText}>{'Generation: '}</Text>
              <Text style={[styles.dataText, styles.dataTextColored]}>
                {generation}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.dataText}>{'Is connection expensive: '}</Text>
              <Text style={[styles.dataText, styles.dataTextColored]}>
                {netInfo?.details?.isConnectionExpensive ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default CellularStatus;
