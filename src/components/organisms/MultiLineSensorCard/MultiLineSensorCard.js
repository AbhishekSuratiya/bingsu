import React, { useContext, useEffect, useState } from 'react';
import Colors from '../../../theme/Colors';
import { Switch, Text, View } from 'react-native';
import { Grid, LineChart, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import styles from './MultiLineSensorCardStyles';
import Collapsible from 'react-native-collapsible';
import {
  SENSOR_CARD_HEADER,
  SENSOR_CARD_HEADER_EXPANDED,
} from '../../../utils/contants';
import { useSelector } from 'react-redux';
import { AwsContext } from '../../../containers/InitialiseAws';
import { LoggerContext } from '../../../containers/Logger';

const MultiLineSensorCard = ({
  sensorData,
  title,
  startSensor,
  stopSensor,
  style,
  defaultListening,
  units = '',
  unitX = '',
  unitY = '',
  unitZ = '',
}) => {
  const [isSensorListening, setIsSensorListening] = useState(defaultListening);
  const { isAwsConnected } = useSelector(state => state.awsStore);
  const client = useContext(AwsContext);
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    if (isSensorListening) {
      stopSensor();
      startSensor();
    } else {
      startSensor();
      stopSensor();
    }
  }, [isAwsConnected, client]);

  const xCoordinate = sensorData?.map(data => data.x);
  const yCoordinate = sensorData?.map(data => data.y);
  const zCoordinate = sensorData?.map(data => data.z);

  const xMax = Math.max(...xCoordinate);
  const yMax = Math.max(...yCoordinate);
  const zMax = Math.max(...zCoordinate);
  const maxValues = [xMax, yMax, zMax];
  const max = maxValues.indexOf(Math.max(...maxValues));

  const data = [
    {
      data: xCoordinate,
      svg: { stroke: Colors.red },
    },
    {
      data: yCoordinate,
      svg: { stroke: Colors.green },
    },
    {
      data: zCoordinate,
      svg: { stroke: Colors.blue },
    },
  ];

  const axesSvg = { fontSize: 10, fill: Colors.white80 };
  const verticalContentInset = { top: 10, bottom: 10 };

  const renderCoordinates = () => (
    <View
      style={[
        styles.coordinatesContainer,
        (units || unitX || unitY || unitZ) && { flexWrap: 'wrap' },
      ]}>
      <View style={styles.coordinatesText}>
        <Text style={styles.coordinates}>x:</Text>
        <Text style={{ color: Colors.red }}>
          {xCoordinate[xCoordinate.length - 1]?.toFixed(4) +
            ' ' +
            (units || unitX)}
        </Text>
      </View>
      <View style={styles.coordinatesText}>
        <Text style={styles.coordinates}>y:</Text>
        <Text style={{ color: Colors.green }}>
          {yCoordinate[yCoordinate.length - 1]?.toFixed(4) +
            ' ' +
            (units + unitY)}
        </Text>
      </View>
      <View style={styles.coordinatesText}>
        <Text style={styles.coordinates}>z:</Text>
        <Text style={{ color: Colors.blue }}>
          {zCoordinate[zCoordinate.length - 1]?.toFixed(4) +
            ' ' +
            (units + unitZ)}
        </Text>
      </View>
    </View>
  );

  const renderSwitch = () => (
    <Switch
      trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
      thumbColor={Colors.white100}
      onValueChange={() => {
        if (isSensorListening) {
          stopSensor();
          cloudWatchLog(`${title} stopped`);
        } else {
          startSensor();
          cloudWatchLog(`${title} started`);
        }
        setIsSensorListening(val => !val);
      }}
      value={isSensorListening}
    />
  );

  return (
    <View style={[styles.root, style]}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View
          style={[
            styles.header,
            isSensorListening && { height: SENSOR_CARD_HEADER_EXPANDED },
          ]}>
          <View style={styles.title}>
            <Text style={styles.sensorTitle}>{title}</Text>
            {isSensorListening && renderCoordinates()}
          </View>
          {renderSwitch()}
        </View>
        {isSensorListening && sensorData.length > 0 && (
          <View style={styles.yAxisContainer}>
            <YAxis
              data={data[max].data}
              contentInset={verticalContentInset}
              svg={axesSvg}
              formatLabel={value => value?.toFixed(4)}
            />
            <View style={styles.lineChartContainer}>
              <LineChart
                style={styles.lineChart}
                data={data}
                svg={{ strokeWidth: 2.5 }}
                curve={shape.curveBasis}
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

export default MultiLineSensorCard;
