import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  barometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import SingleLineSensorCard from '../SingleLineSensorCard/SingleLineSensorCard';
import { LoggerContext } from '../../../containers/Logger';

const BarometerSensor = props => {
  const [barometerData, setBarometerData] = useState([]);
  const subscriptionBarometer = useRef(null);
  const client = useContext(AwsContext);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const cloudWatchLog = useContext(LoggerContext);

  const startBarometer = () => {
    setUpdateIntervalForType(SensorTypes.barometer, AWS_SEND_MESSAGE_INTERVAL);
    subscriptionBarometer.current = barometer.subscribe({
      next: data => {
        setBarometerData(prev => [...prev.slice(-20), data.pressure]);
        if (isAwsConnected) {
          const command = new BatchPutAssetPropertyValueCommand({
            entries: [
              getCommandEntry({
                entryId: 'AssetModelBarometerMeasurement',
                propertyAlias:
                  ASSET_MODEL_MEASUREMENTS_PREFIX + 'BarometerMeasurement',
                value: data.pressure,
              }),
            ],
          });
          client?.send(command);
        }
      },
      error: error => {
        props.setIsBarometerAvailable(false);
        console.log('The sensor is not available', error);
        cloudWatchLog('Barometer is not available');
      },
    });
  };
  const stopBarometer = () => {
    subscriptionBarometer.current?.unsubscribe();
  };
  useEffect(() => {
    startBarometer();
    setTimeout(() => {
      stopBarometer();
    }, AWS_SEND_MESSAGE_INTERVAL * 2);
    return () => {};
  }, []);

  return (
    <SingleLineSensorCard
      sensorData={barometerData}
      title={'Barometer'}
      startSensor={startBarometer}
      stopSensor={stopBarometer}
      units={'hPa'}
    />
  );
};

export default BarometerSensor;
