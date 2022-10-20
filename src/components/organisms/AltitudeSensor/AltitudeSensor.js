import React, { useContext, useEffect } from 'react';
import { AwsContext } from '../../../containers/InitialiseAws';
import { useDispatch, useSelector } from 'react-redux';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import getCommandEntry from '../../../utils/getCommandEntry';
import SingleLineSensorCard from '../SingleLineSensorCard/SingleLineSensorCard';
import { locationAction } from '../../../redux/reducers/locationReducer';

const AltitudeSensor = () => {
  const client = useContext(AwsContext);
  const {
    isAwsConnected,
    qrData: { ASSET_MODEL_MEASUREMENTS_PREFIX },
  } = useSelector(state => state.awsStore);
  const {
    altitude,
    isAltitudeListening,
    hasLocationPermission,
    checkingForPermission,
  } = useSelector(state => state.locationStore);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAwsConnected && isAltitudeListening) {
      const command = new BatchPutAssetPropertyValueCommand({
        entries: [
          getCommandEntry({
            entryId: 'AssetModelAltitudeMeasurement',
            propertyAlias:
              ASSET_MODEL_MEASUREMENTS_PREFIX + 'AltitudeMeasurement',
            value: altitude[altitude.length - 1],
          }),
        ],
      });
      client?.send(command);
    }
  }, [altitude, isAwsConnected, isAltitudeListening]);

  const startAltitude = () => {
    dispatch(locationAction.setIsAltitudeListening(true));
  };

  const stopAltitude = () => {
    dispatch(locationAction.setIsAltitudeListening(false));
  };

  return (
    <SingleLineSensorCard
      sensorData={altitude}
      title={'Altitude'}
      startSensor={startAltitude}
      stopSensor={stopAltitude}
      units={'m'}
      permissionDenied={!hasLocationPermission}
      checkingForPermission={checkingForPermission}
    />
  );
};

export default AltitudeSensor;
