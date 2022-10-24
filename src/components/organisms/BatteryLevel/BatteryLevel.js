import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../BatteryLevel/BatteryLevelStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import { usePowerState } from 'react-native-device-info';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import { useSelector } from 'react-redux';
import { AwsContext } from '../../../containers/InitialiseAws';

const BatteryLevel = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const powerState = usePowerState();
  const batteryLevel = useMemo(
    () => (powerState?.batteryLevel * 100).toFixed(2),
    [powerState],
  );
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);

  useEffect(() => {
    if (isAwsConnected && isSensorListening) {
      const command = new BatchPutAssetPropertyValueCommand({
        entries: [
          {
            entryId: 'BatteryLevelMeasurement',
            propertyAlias:
              ASSET_MODEL_MEASUREMENTS_PREFIX + 'BatteryLevelMeasurement',
            propertyValues: [
              {
                value: {
                  doubleValue: powerState?.batteryLevel * 100,
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
                  stringValue: ['charging', 'full'].includes(
                    powerState?.batteryState,
                  )
                    ? 'Charging'
                    : 'Not charging',
                },
                timestamp: { timeInSeconds: Date.now() / 1000 },
              },
            ],
          },
        ],
      });
      client?.send(command);
    }
  }, [powerState, isAwsConnected, isSensorListening]);

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
              ['charging', 'full'].includes(powerState?.batteryState)
                ? 'Yes'
                : 'No'
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
