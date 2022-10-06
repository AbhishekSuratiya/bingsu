import React, { useContext, useRef, useState } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import {
  gyroscope,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import styles from '../../screens/SensorScreen/SensorScreenStyles';
import MultiLineSensorCard from '../MultiLineSensorCard/MultiLineSensorCard';

const GyroscopeSensor = props => {
  const [gyroscopeData, setGyroscopeData] = useState([]);
  const subscriptionGyroscope = useRef(null);
  const client = useContext(AwsContext);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);
  const startGyroscope = () => {
    setUpdateIntervalForType(SensorTypes.gyroscope, AWS_SEND_MESSAGE_INTERVAL);
    subscriptionGyroscope.current = gyroscope.subscribe({
      next: data => {
        setGyroscopeData(prev => [...prev.slice(-20), data]);
        if (isAwsConnected) {
          const command = new BatchPutAssetPropertyValueCommand({
            entries: [
              getCommandEntry({
                entryId: 'GyroscopeXMeasurement',
                propertyAlias: qrData.AssetModelGyroscopeXMeasurement,
                value: data.x,
              }),
              getCommandEntry({
                entryId: 'GyroscopeYMeasurement',
                propertyAlias: qrData.AssetModelGyroscopeYMeasurement,
                value: data.y,
              }),
              getCommandEntry({
                entryId: 'GyroscopeZMeasurement',
                propertyAlias: qrData.AssetModelGyroscopeZMeasurement,
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
  const stopGyroscope = () => {
    subscriptionGyroscope.current?.unsubscribe();
  };
  return (
    <MultiLineSensorCard
      sensorData={gyroscopeData}
      title={'Gyroscope'}
      startSensor={startGyroscope}
      stopSensor={stopGyroscope}
      style={styles.sensorCard}
    />
  );
};

export default GyroscopeSensor;
