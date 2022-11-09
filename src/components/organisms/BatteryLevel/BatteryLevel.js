import React, { useContext, useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../BatteryLevel/BatteryLevelStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { usePowerState } from 'react-native-device-info';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { useSelector } from 'react-redux';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useBatteryLevel } from 'react-native-device-info';
import { LoggerContext } from '../../../containers/Logger';
import DeviceInfo from 'react-native-device-info';

const BatteryLevel = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [isCharging, setIsCharging] = useState('');
  const powerState = usePowerState();
  const batteryLevel = useBatteryLevel();
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    (async () => {
      if (isAwsConnected && isSensorListening) {
        const charging = await DeviceInfo.isBatteryCharging();
        setIsCharging(charging ? 'Yes' : 'No');
        const command = new BatchPutAssetPropertyValueCommand({
          entries: [
            {
              entryId: 'BatteryLevelMeasurement',
              propertyAlias:
                ASSET_MODEL_MEASUREMENTS_PREFIX + 'BatteryLevelMeasurement',
              propertyValues: [
                {
                  value: {
                    doubleValue: batteryLevel * 100,
                  },
                  timestamp: { timeInSeconds: Date.now() / 1000 },
                },
              ],
            },
            {
              entryId: 'ChargingStatusMeasurement',
              propertyAlias:
                ASSET_MODEL_MEASUREMENTS_PREFIX + 'ChargingStatusMeasurement',
              propertyValues: [
                {
                  value: {
                    stringValue: charging ? 'Yes' : 'No',
                  },
                  timestamp: { timeInSeconds: Date.now() / 1000 },
                },
              ],
            },
          ],
        });
        client?.send(command);
      }
    })();
  }, [powerState, isAwsConnected, isSensorListening, batteryLevel]);

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
                if (isSensorListening) {
                  cloudWatchLog('Battery usage monitoring stopped');
                } else {
                  cloudWatchLog('Battery usage monitoring started');
                }
                setIsSensorListening(val => !val);
              }}
              value={isSensorListening}
            />
          </View>

          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.dataText}>{'Level: '}</Text>
              <Text style={[styles.dataText, styles.dataTextColored]}>{`${(
                batteryLevel * 100
              ).toFixed()}%`}</Text>
            </View>
            <Text style={styles.dataText}>{`Charging: ${isCharging}`}</Text>
          </View>

          <View style={styles.batteryLevelWrapper}>
            <View
              style={[
                styles.batteryLevel,
                {
                  width: `${batteryLevel * 100}%`,
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
