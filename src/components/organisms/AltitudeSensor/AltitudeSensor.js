import React, { useContext, useRef, useState } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import GetLocation from 'react-native-get-location';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import SingleLineSensorCard from '../SingleLineSensorCard/SingleLineSensorCard';

const AltitudeSensor = props => {
  const [altitudeData, setAltitudeData] = useState([]);
  const subscriptionAltitude = useRef(null);
  const client = useContext(AwsContext);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);
  const startAltitude = () => {
    subscriptionAltitude.current = setInterval(() => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      })
        .then(location => {
          setAltitudeData(prev => [...prev.slice(-20), location.altitude]);
          if (isAwsConnected) {
            const command = new BatchPutAssetPropertyValueCommand({
              entries: [
                getCommandEntry({
                  entryId: 'AssetModelAltitudeMeasurement',
                  propertyAlias: qrData.AssetModelAltitudeMeasurement,
                  value: location.altitude,
                }),
              ],
            });
            client?.send(command);
          }
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        });
    }, 1000);
  };
  const stopAltitude = () => {
    clearInterval(subscriptionAltitude.current);
  };
  return (
    <SingleLineSensorCard
      sensorData={altitudeData}
      title={'Altitude'}
      startSensor={startAltitude}
      stopSensor={stopAltitude}
      units={'m'}
    />
  );
};

export default AltitudeSensor;
