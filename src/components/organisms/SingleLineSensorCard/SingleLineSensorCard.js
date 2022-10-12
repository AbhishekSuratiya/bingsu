import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import styles from './SingleLineSensorCardStyles';
import Collapsible from 'react-native-collapsible';
import Colors from '../../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import { Grid, LineChart, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { useSelector } from 'react-redux';

const SingleLineSensorCard = ({
  title,
  startSensor,
  stopSensor,
  sensorData,
  units,
  curve,
  hideSubtitle,
  toFixed,
  permissionDenied,
  checkingForPermission,
}) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const { isAwsConnected } = useSelector(state => state.awsStore);

  useEffect(() => {
    if (isSensorListening) {
      stopSensor();
      startSensor();
    } else {
      startSensor();
      stopSensor();
    }
  }, [isAwsConnected]);

  useEffect(() => {
    if (permissionDenied && !checkingForPermission) {
      setIsSensorListening(false);
    }
  }, [checkingForPermission]);

  useEffect(() => {
    if (isSensorListening) {
      startSensor();
    } else {
      stopSensor();
    }
  }, [isSensorListening]);

  const verticalContentInset = { top: 10, bottom: 10 };
  const axesSvg = { fontSize: 10, fill: Colors.white80 };

  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {isSensorListening && !hideSubtitle && sensorData.length > 0 && (
              <Text style={styles.currentValue}>{`${sensorData[
                sensorData.length - 1
              ]?.toFixed(toFixed || 4)} ${units}`}</Text>
            )}
          </View>
          <Switch
            trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
            thumbColor={Colors.white100}
            onValueChange={() => setIsSensorListening(val => !val)}
            value={isSensorListening}
          />
        </View>
        {isSensorListening && (
          <View style={styles.yAxisContainer}>
            <YAxis
              data={sensorData}
              contentInset={verticalContentInset}
              svg={axesSvg}
              formatLabel={value => value?.toFixed(toFixed || 4)}
            />
            <View style={styles.lineChartContainer}>
              <LineChart
                style={styles.lineChart}
                data={sensorData}
                svg={{ strokeWidth: 2.5, stroke: Colors.blue }}
                curve={curve || shape.curveBasis}
                contentInset={verticalContentInset}>
                <Grid svg={{ stroke: Colors.grey }} />
              </LineChart>
            </View>
          </View>
        )}
      </Collapsible>
    </View>
  );
};

export default SingleLineSensorCard;
