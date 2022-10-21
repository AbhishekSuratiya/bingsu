import React, { useContext, useRef, useState } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import styles from '../../screens/SensorScreen/SensorScreenStyles';
import MultiLineSensorCard from '../MultiLineSensorCard/MultiLineSensorCard';

const MagnetometerSensor = props => {
  const [magnetometerData, setMagnetometerData] = useState([]);
  const subscriptionMagnetometer = useRef(null);
  const client = useContext(AwsContext);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const startMagnetometer = () => {
    setUpdateIntervalForType(
      SensorTypes.magnetometer,
      AWS_SEND_MESSAGE_INTERVAL,
    );
    subscriptionMagnetometer.current = magnetometer.subscribe({
      next: data => {
        setMagnetometerData(prev => [...prev.slice(-20), data]);
        if (isAwsConnected) {
          const command = new BatchPutAssetPropertyValueCommand({
            entries: [
              getCommandEntry({
                entryId: 'MagnetometerXMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'MagnetometerXMeasurement',
                value: data.x,
              }),
              getCommandEntry({
                entryId: 'MagnetometerYMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'MagnetometerYMeasurement',
                value: data.y,
              }),
              getCommandEntry({
                entryId: 'MagnetometerZMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'MagnetometerZMeasurement',
                value: data.z,
              }),
            ],
          });
          client?.send(command);
        }
      },
      error: error => console.log('The sensor is not available', error),
    });
  };
  const stopMagnetometer = () => {
    subscriptionMagnetometer.current?.unsubscribe();
  };
  return (
    <MultiLineSensorCard
      sensorData={magnetometerData}
      title={'Magnetometer'}
      startSensor={startMagnetometer}
      stopSensor={stopMagnetometer}
      style={styles.sensorCard}
      units={'µT'}
    />
  );
};

export default MagnetometerSensor;
