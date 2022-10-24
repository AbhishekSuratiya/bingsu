import React, { useContext, useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../WifiStatus/WifiStatusStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { AwsContext } from '../../../containers/InitialiseAws';

const WifiStatus = () => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [strength, setStrength] = useState(false);
  const netInfo = useNetInfo();
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);

  useEffect(() => {
    setIsConnected(netInfo?.type === 'wifi' ? 'Yes' : 'No');
    setStrength(netInfo?.details?.strength || 0);
    if (isAwsConnected && isSensorListening) {
      const command = new BatchPutAssetPropertyValueCommand({
        entries: [
          {
            entryId: 'WifiSignalsMeasurement',
            propertyAlias:
              ASSET_MODEL_MEASUREMENTS_PREFIX + 'WifiSignalsMeasurement',
            propertyValues: [
              {
                value: { doubleValue: netInfo?.details?.strength },
                timestamp: { timeInSeconds: Date.now() / 1000 },
              },
            ],
          },
          {
            entryId: 'WifiConnectMeasurement',
            propertyAlias:
              ASSET_MODEL_MEASUREMENTS_PREFIX + 'WifiConnectMeasurement',
            propertyValues: [
              {
                value: { stringValue: netInfo?.type === 'wifi' ? 'Yes' : 'No' },
                timestamp: { timeInSeconds: Date.now() / 1000 },
              },
            ],
          },
        ],
      });
      client?.send(command);
    }
  }, [netInfo, isSensorListening, isAwsConnected]);

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
