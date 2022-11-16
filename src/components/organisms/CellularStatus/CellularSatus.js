import React, { useContext, useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../CellularStatus/CellularSatusStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { useNetInfo } from '@react-native-community/netinfo';
import * as NetInfo from '@react-native-community/netinfo';
import { LoggerContext } from '../../../containers/Logger';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { useSelector } from 'react-redux';
import { AwsContext } from '../../../containers/InitialiseAws';

const CellularStatus = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [generation, setGeneration] = useState('');
  const netInfo = useNetInfo();
  const cloudWatchLog = useContext(LoggerContext);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);

  useEffect(() => {
    NetInfo.fetch('cellular').then(state => {
      const carrierDetail = state?.details?.carrier || 'No SIM card';
      const generationDetail = state?.details?.cellularGeneration
        ? state?.details?.cellularGeneration
        : netInfo?.type === 'none'
        ? 'No network'
        : 'Connected to Wifi';
      setCarrier(carrierDetail);
      setGeneration(generationDetail);

      if (isAwsConnected && isSensorListening) {
        const command = new BatchPutAssetPropertyValueCommand({
          entries: [
            {
              entryId: 'AssetModelCarrierName',
              propertyAlias: ASSET_MODEL_MEASUREMENTS_PREFIX + 'CarrierName',
              propertyValues: [
                {
                  value: {
                    stringValue: carrierDetail,
                  },
                  timestamp: { timeInSeconds: Date.now() / 1000 },
                },
              ],
            },
            {
              entryId: 'AssetModelCarrierGeneration',
              propertyAlias:
                ASSET_MODEL_MEASUREMENTS_PREFIX + 'CarrierGeneration',
              propertyValues: [
                {
                  value: {
                    stringValue: generationDetail,
                  },
                  timestamp: { timeInSeconds: Date.now() / 1000 },
                },
              ],
            },
            {
              entryId: 'AssetModelIsCarrierExpensive',
              propertyAlias:
                ASSET_MODEL_MEASUREMENTS_PREFIX + 'IsCarrierExpensive',
              propertyValues: [
                {
                  value: {
                    stringValue: netInfo?.details?.isConnectionExpensive
                      ? 'Yes'
                      : 'No',
                  },
                  timestamp: { timeInSeconds: Date.now() / 1000 },
                },
              ],
            },
          ],
        });
        client?.send(command);
      }
    });
  }, [netInfo, isAwsConnected, isSensorListening]);

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
