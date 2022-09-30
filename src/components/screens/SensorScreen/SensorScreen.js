import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  DeviceEventEmitter,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import MultiLineSensorCard from '../../organisms/MultiLineSensorCard/MultiLineSensorCard';
import {
  accelerometer,
  barometer,
  gyroscope,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import CameraSensorCard from '../../organisms/CameraSensorCard/CameraSensorCard';
import styles from './SensorScreenStyles';
import { AwsContext } from '../../../containers/InitialiseAws';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../../utils/contants';
import Button from '../../atoms/Button';
import { useSelector } from 'react-redux';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import SingleLineSensorCard from '../../organisms/SingleLineSensorCard/SingleLineSensorCard';
import GetLocation from 'react-native-get-location';
import LocationSensorMap from '../../organisms/LocationSensorMap/LocationSensorMap';
import Proximity from 'react-native-proximity';
import * as shape from 'd3-shape';
import getCommandEntry from '../../../utils/getCommandEntry';
import {
  startLightSensor,
  stopLightSensor,
} from 'react-native-ambient-light-sensor';

const SensorScreen = ({ navigation }) => {
  const [accelerometerData, setAccelerometerData] = useState([]);
  const [gyroscopeData, setGyroscopeData] = useState([]);
  const [magnetometerData, setMagnetometerData] = useState([]);
  const [barometerData, setBarometerData] = useState([]);
  const [orientationData, setOrientationData] = useState([]);
  const [altitudeData, setAltitudeData] = useState([]);
  const [proximityData, setProximityData] = useState([]);
  const [ambientLightData, setAmbientLightData] = useState([]);

  const subscriptionAccelerometer = useRef(null);
  const subscriptionGyroscope = useRef(null);
  const subscriptionMagnetometer = useRef(null);
  const subscriptionBarometer = useRef(null);
  const subscriptionOrientationAcc = useRef(null);
  const subscriptionOrientationMag = useRef(null);
  const subscriptionAltitude = useRef(null);
  const subscriptionProximity = useRef(null);
  const subscriptionAmbientLight = useRef(null);
  const orientationXYData = useRef({});

  const client = useContext(AwsContext);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);

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
                propertyAlias: qrData.AssetModelAccelerometerXMeasurement,
                value: data.x,
              }),
              getCommandEntry({
                entryId: 'AccelerometerYMeasurement',
                propertyAlias: qrData.AssetModelAccelerometerYMeasurement,
                value: data.y,
              }),
              getCommandEntry({
                entryId: 'AccelerometerZMeasurement',
                propertyAlias: qrData.AssetModelAccelerometerZMeasurement,
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
                propertyAlias: qrData.AssetModelMagnetometerXMeasurement,
                value: data.x,
              }),
              getCommandEntry({
                entryId: 'MagnetometerYMeasurement',
                propertyAlias: qrData.AssetModelMagnetometerYMeasurement,
                value: data.y,
              }),
              getCommandEntry({
                entryId: 'MagnetometerZMeasurement',
                propertyAlias: qrData.AssetModelMagnetometerZMeasurement,
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
                  propertyAlias: qrData.AssetModelOrientationXMeasurement,
                  value: x,
                }),
                getCommandEntry({
                  entryId: 'AssetModelOrientationYMeasurement',
                  propertyAlias: qrData.AssetModelOrientationYMeasurement,
                  value: y,
                }),
                getCommandEntry({
                  entryId: 'AssetModelOrientationZMeasurement',
                  propertyAlias: qrData.AssetModelOrientationZMeasurement,
                  value: data.z,
                }),
              ],
            });
            client?.send(command);
          }
        }
      },
      error: error => console.log('The sensor is not available', error),
    });
  };

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
                propertyAlias: qrData.AssetModelBarometerMeasurement,
                value: data.pressure,
              }),
            ],
          });
          client?.send(command);
        }
      },
      error: error => console.log('The sensor is not available', error),
    });
  };

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
  const startProximity = () => {
    subscriptionProximity.current = ({ proximity }) => {
      setProximityData(prev => [...prev.slice(-20), proximity ? 1 : 0]);
      if (isAwsConnected) {
        const command = new BatchPutAssetPropertyValueCommand({
          entries: [
            getCommandEntry({
              entryId: 'AssetModelProximityValue',
              propertyAlias: qrData.AssetModelProximityValue,
              value: proximity ? 1 : 0,
            }),
          ],
        });
        client?.send(command);
      }
    };
    Proximity.addListener(subscriptionProximity.current);
  };

  const startAmbientLight = () => {
    startLightSensor();
    subscriptionAmbientLight.current = DeviceEventEmitter.addListener(
      'LightSensor',
      data => {
        setAmbientLightData(prev => [...prev.slice(-20), data.lightValue]);
      },
    );
  };
  const stopAccelerometer = () => {
    subscriptionAccelerometer.current.unsubscribe();
  };
  const stopGyroscope = () => {
    subscriptionGyroscope.current.unsubscribe();
  };
  const stopMagnetometer = () => {
    subscriptionMagnetometer.current.unsubscribe();
  };
  const stopOrientation = () => {
    subscriptionOrientationMag.current.unsubscribe();
    subscriptionOrientationAcc.current.unsubscribe();
  };
  const stopBarometer = () => {
    subscriptionBarometer.current.unsubscribe();
  };
  const stopAltitude = () => {
    clearInterval(subscriptionAltitude.current);
  };
  const stopProximity = () => {
    Proximity.removeListener(subscriptionProximity.current);
  };
  const stopAmbientLight = () => {
    stopLightSensor();
    subscriptionAmbientLight.current?.remove();
  };

  useEffect(() => {
    startAccelerometer();
    return () => {
      stopAccelerometer();
      stopGyroscope();
      stopMagnetometer();
      stopBarometer();
      stopAltitude();
      stopProximity();
      stopAmbientLight();
    };
  }, []);

  const renderConnectToAwsCard = () => {
    return (
      <View style={styles.connectToAwsSpacing}>
        <View style={styles.connectToAwsWrapper}>
          <Text style={styles.connectToAws}>Connect to AWS</Text>
          <Text style={styles.saveYourData}>
            Save your sensor data by connecting to AWS
          </Text>
          <Button
            title={'Connect'}
            onPress={() => navigation.navigate('ScanQr')}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      {!isAwsConnected && renderConnectToAwsCard()}
      <MultiLineSensorCard
        sensorData={accelerometerData}
        title={'Accelerometer'}
        startSensor={startAccelerometer}
        stopSensor={stopAccelerometer}
        style={styles.sensorCard}
        defaultListening
      />
      <MultiLineSensorCard
        sensorData={gyroscopeData}
        title={'Gyroscope'}
        startSensor={startGyroscope}
        stopSensor={stopGyroscope}
        style={styles.sensorCard}
      />
      <MultiLineSensorCard
        sensorData={magnetometerData}
        title={'Magnetometer'}
        startSensor={startMagnetometer}
        stopSensor={stopMagnetometer}
        style={styles.sensorCard}
      />
      <MultiLineSensorCard
        sensorData={orientationData}
        title={'Orientation'}
        startSensor={startOrientation}
        stopSensor={stopOrientation}
        style={styles.sensorCard}
      />
      <CameraSensorCard title={'Video'} />
      <LocationSensorMap title={'GPS'} />
      <SingleLineSensorCard
        sensorData={barometerData}
        title={'Barometer'}
        startSensor={startBarometer}
        stopSensor={stopBarometer}
        units={'hPA'}
      />
      <SingleLineSensorCard
        sensorData={altitudeData}
        title={'Altitude'}
        startSensor={startAltitude}
        stopSensor={stopAltitude}
        units={'m'}
      />
      <SingleLineSensorCard
        sensorData={proximityData}
        title={'Proximity'}
        startSensor={startProximity}
        stopSensor={stopProximity}
        curve={shape.curveLinear}
        toFixed={1}
        hideSubtitle
      />
      {Platform.OS === 'android' && (
        <SingleLineSensorCard
          sensorData={ambientLightData}
          title={'Ambient Light'}
          startSensor={startAmbientLight}
          stopSensor={stopAmbientLight}
          units={'lux'}
          toFixed={1}
        />
      )}
    </ScrollView>
  );
};

export default SensorScreen;
