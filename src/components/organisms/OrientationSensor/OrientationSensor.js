import React, { useContext, useRef, useState } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import {
  accelerometer,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import styles from '../../screens/SensorScreen/SensorScreenStyles';
import MultiLineSensorCard from '../MultiLineSensorCard/MultiLineSensorCard';
import { LoggerContext } from '../../../containers/Logger';

const OrientationSensor = props => {
  const [orientationData, setOrientationData] = useState([]);
  const subscriptionOrientationAcc = useRef(null);
  const subscriptionOrientationMag = useRef(null);
  const orientationXYData = useRef({});
  const client = useContext(AwsContext);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const cloudWatchLog = useContext(LoggerContext);

  const startOrientation = () => {
    setUpdateIntervalForType(
      SensorTypes.accelerometer,
      AWS_SEND_MESSAGE_INTERVAL,
    );
    setUpdateIntervalForType(
      SensorTypes.magnetometer,
      AWS_SEND_MESSAGE_INTERVAL,
    );
    subscriptionOrientationAcc.current = accelerometer.subscribe({
      next: data => {
        orientationXYData.current.x = data.x;
        orientationXYData.current.y = data.y;
      },
      error: error => console.log('The sensor is not available', error),
    });
    subscriptionOrientationMag.current = magnetometer.subscribe({
      next: data => {
        const x = orientationXYData.current.x;
        const y = orientationXYData.current.y;
        if (x && y) {
          setOrientationData(prev => [...prev.slice(-20), { x, y, z: data.z }]);
          if (isAwsConnected) {
            const command = new BatchPutAssetPropertyValueCommand({
              entries: [
                getCommandEntry({
                  entryId: 'AssetModelOrientationXMeasurement',
                  propertyAlias:
                    ASSET_MODEL_MEASUREMENTS_PREFIX + 'OrientationXMeasurement',
                  value: x,
                }),
                getCommandEntry({
                  entryId: 'AssetModelOrientationYMeasurement',
                  propertyAlias:
                    ASSET_MODEL_MEASUREMENTS_PREFIX + 'OrientationYMeasurement',
                  value: y,
                }),
                getCommandEntry({
                  entryId: 'AssetModelOrientationZMeasurement',
                  propertyAlias:
                    ASSET_MODEL_MEASUREMENTS_PREFIX + 'OrientationZMeasurement',
                  value: data.z,
                }),
              ],
            });
            client?.send(command);
          }
        }
      },
      error: error => {
        console.log('The sensor is not available', error);
        cloudWatchLog('Orientation is not available');
      },
    });
  };
  const stopOrientation = () => {
    subscriptionOrientationMag.current?.unsubscribe();
    subscriptionOrientationAcc.current?.unsubscribe();
  };

  return (
    <MultiLineSensorCard
      sensorData={orientationData}
      title={'Orientation'}
      startSensor={startOrientation}
      stopSensor={stopOrientation}
      style={styles.sensorCard}
      unitX={'m/s²'}
      unitY={'m/s²'}
      unitZ={'°/s'}
    />
  );
};

export default OrientationSensor;
