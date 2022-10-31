import React, { useContext, useRef, useState } from 'react';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import styles from '../../screens/SensorScreen/SensorScreenStyles';
import MultiLineSensorCard from '../MultiLineSensorCard/MultiLineSensorCard';
import { LoggerContext } from '../../../containers/Logger';

const AccelerometerSensor = props => {
  const [accelerometerData, setAccelerometerData] = useState([]);
  const subscriptionAccelerometer = useRef(null);
  const client = useContext(AwsContext);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const cloudWatchLog = useContext(LoggerContext);

  const startAccelerometer = () => {
    setUpdateIntervalForType(
      SensorTypes.accelerometer,
      AWS_SEND_MESSAGE_INTERVAL,
    );
    subscriptionAccelerometer.current = accelerometer.subscribe({
      next: data => {
        setAccelerometerData(prev => [...prev.slice(-20), data]);
        if (isAwsConnected) {
          const command = new BatchPutAssetPropertyValueCommand({
            entries: [
              getCommandEntry({
                entryId: 'AccelerometerXMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'AccelerometerXMeasurement',
                value: data.x,
              }),
              getCommandEntry({
                entryId: 'AccelerometerYMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'AccelerometerYMeasurement',
                value: data.y,
              }),
              getCommandEntry({
                entryId: 'AccelerometerZMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'AccelerometerZMeasurement',
                value: data.z,
              }),
            ],
          });
          client?.send(command);
        }
      },
      error: error => {
        console.log('The sensor is not available', error);
        cloudWatchLog('Accelerometer is not available');
      },
    });
  };
  const stopAccelerometer = () => {
    subscriptionAccelerometer.current?.unsubscribe();
  };

  return (
    <MultiLineSensorCard
      sensorData={accelerometerData}
      title={'Accelerometer'}
      startSensor={startAccelerometer}
      stopSensor={stopAccelerometer}
      style={styles.sensorCard}
      units={'m/s²'}
      defaultListening
    />
  );
};

export default AccelerometerSensor;
