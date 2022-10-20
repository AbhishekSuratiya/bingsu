import React, { useContext, useRef, useState } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import {
  startLightSensor,
  stopLightSensor,
} from 'react-native-ambient-light-sensor';
import { DeviceEventEmitter, Platform } from 'react-native';
import SingleLineSensorCard from '../SingleLineSensorCard/SingleLineSensorCard';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';

const AmbientLightSensor = props => {
  const [ambientLightData, setAmbientLightData] = useState([]);
  const subscriptionAmbientLight = useRef(null);
  const timer = useRef(null);
  const client = useContext(AwsContext);

  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);

  const startAmbientLight = () => {
    startLightSensor();
    subscriptionAmbientLight.current = DeviceEventEmitter.addListener(
      'LightSensor',
      data => {
        if (Date.now() - timer.current > AWS_SEND_MESSAGE_INTERVAL) {
          timer.current = Date.now();
          setAmbientLightData(prev => [...prev.slice(-20), data.lightValue]);
          if (isAwsConnected) {
            const command = new BatchPutAssetPropertyValueCommand({
              entries: [
                getCommandEntry({
                  entryId: 'AssetModelAmbientLightMeasurement',
                  propertyAlias:
                    ASSET_MODEL_MEASUREMENTS_PREFIX + 'AmbientLightMeasurement',
                  value: data.lightValue,
                }),
              ],
            });
            client?.send(command);
          }
        }
      },
    );
  };

  const stopAmbientLight = () => {
    stopLightSensor();
    subscriptionAmbientLight.current.remove();
  };

  return (
    Platform.OS === 'android' && (
      <SingleLineSensorCard
        sensorData={ambientLightData}
        title={'Ambient Light'}
        startSensor={startAmbientLight}
        stopSensor={stopAmbientLight}
        units={'lux'}
        toFixed={1}
      />
    )
  );
};

export default AmbientLightSensor;
