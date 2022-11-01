import React, { useContext, useEffect, useRef, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from '../CpuUsage/CpuUsageStyles';
import Collapsible from 'react-native-collapsible';
import {
  AWS_SEND_MESSAGE_INTERVAL,
  SENSOR_CARD_HEADER,
} from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import PerformanceStats from 'react-native-performance-stats';
import { useSelector } from 'react-redux';
import { AwsContext } from '../../../containers/InitialiseAws';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import { LoggerContext } from '../../../containers/Logger';

const CpuUsage = props => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(0);
  const subscriptionCpu = useRef(null);
  const timer = useRef(null);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    if (!isSensorListening) {
      return;
    }
    startSensor();
    return stopSensor;
  }, [isSensorListening]);

  const startSensor = () => {
    subscriptionCpu.current = PerformanceStats.addListener(stats => {
      if (Date.now() - timer.current > AWS_SEND_MESSAGE_INTERVAL) {
        timer.current = Date.now();
        setCpuUsage(stats.usedCpu.toFixed(2));
        if (isAwsConnected && isSensorListening) {
          const command = new BatchPutAssetPropertyValueCommand({
            entries: [
              getCommandEntry({
                entryId: 'CPULevelMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'CPULevelMeasurement',
                value: stats.usedCpu,
              }),
            ],
          });
          client?.send(command);
        }
      }
    });
    PerformanceStats.start(true);
  };

  const stopSensor = () => {
    PerformanceStats.stop();
    subscriptionCpu.current.remove();
  };
  useEffect(() => {
    if (isSensorListening) {
      stopSensor();
      startSensor();
    } else {
      startSensor();
      stopSensor();
    }
  }, [isAwsConnected]);

  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{'CPU'}</Text>
            <Switch
              trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
              thumbColor={Colors.white100}
              onValueChange={() => {
                if (isSensorListening) {
                  cloudWatchLog('CPU usage monitoring stopped');
                } else {
                  cloudWatchLog('CPU usage monitoring started');
                }
                setIsSensorListening(val => !val);
              }}
              value={isSensorListening}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.dataText}>{'Usage: '}</Text>
            <Text style={[styles.dataText, styles.dataTextColored]}>
              {`${cpuUsage}%`}
            </Text>
          </View>
          <View style={styles.cpuUsageWrapper}>
            <View
              style={[
                styles.cpuUsage,
                {
                  width: `${cpuUsage}%`,
                },
              ]}
            />
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default CpuUsage;
