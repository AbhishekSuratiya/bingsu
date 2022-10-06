import React, { useContext, useRef, useState } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useSelector } from 'react-redux';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import Proximity from 'react-native-proximity';
import * as shape from 'd3-shape';
import SingleLineSensorCard from '../SingleLineSensorCard/SingleLineSensorCard';

const ProximitySensor = props => {
  const [proximityData, setProximityData] = useState([]);
  const subscriptionProximity = useRef(null);
  const client = useContext(AwsContext);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);
  const startProximity = () => {
    subscriptionProximity.current = ({ proximity }) => {
      setProximityData(prev => [...prev.slice(-20), proximity ? 1 : 0]);
      if (isAwsConnected) {
        const command = new BatchPutAssetPropertyValueCommand({
          entries: [
            {
              entryId: 'AssetModelProximityValue',
              propertyAlias: qrData.AssetModelProximityValue,
              propertyValues: [
                {
                  value: { integerValue: proximity ? 1 : 0 },
                  timestamp: { timeInSeconds: Date.now() / 1000 },
                },
              ],
            },
          ],
        });
        client?.send(command);
      }
    };
    Proximity.addListener(subscriptionProximity.current);
  };
  const stopProximity = () => {
    Proximity.removeListener(subscriptionProximity.current);
  };
  return (
    <SingleLineSensorCard
      sensorData={proximityData}
      title={'Proximity'}
      startSensor={startProximity}
      stopSensor={stopProximity}
      curve={shape.curveLinear}
      toFixed={1}
      hideSubtitle
    />
  );
};

export default ProximitySensor;
