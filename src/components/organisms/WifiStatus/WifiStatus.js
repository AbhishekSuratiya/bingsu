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
import { LoggerContext } from '../../../containers/Logger';
import { Grid, LineChart, YAxis } from 'react-native-svg-charts';

const yAxisValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const WifiStatus = () => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [strength, setStrength] = useState(false);
  const [strengthData, setStrengthData] = useState([0]);
  const netInfo = useNetInfo();
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    setIsConnected(netInfo?.type === 'wifi' ? 'Yes' : 'No');
    setStrength(netInfo?.details?.strength || 0);
    setStrengthData(prev => [...prev, netInfo?.details?.strength || 0]);
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

  const verticalContentInset = { top: 10, bottom: 10 };
  const axesSvg = { fontSize: 10, fill: Colors.white80 };

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
                if (isSensorListening) {
                  cloudWatchLog('Wifi usage monitoring stopped');
                } else {
                  cloudWatchLog('Wifi usage monitoring started');
                }
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

          <View style={styles.yAxisContainer}>
            <YAxis
              data={yAxisValues}
              contentInset={verticalContentInset}
              svg={axesSvg}
              formatLabel={value => value?.toFixed(1)}
            />
            <View style={styles.lineChartContainer}>
              <LineChart
                style={styles.lineChart}
                data={strengthData}
                svg={{ strokeWidth: 2.5, stroke: Colors.blue }}
                contentInset={verticalContentInset}>
                <Grid svg={{ stroke: Colors.grey }} />
              </LineChart>
            </View>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default WifiStatus;
