import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MultiLineSensorCard from '../organisms/MultiLineSensorCard';
import {
  accelerometer,
  barometer,
  gyroscope,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import CameraSensorCard from '../organisms/CameraSensorCard';
import styles from './SensorScreenStyles';
import { AwsContext } from '../../containers/InitialiseAws';
import { AWS_SEND_MESSAGE_INTERVAL } from '../../utils/contants';
import Button from '../atoms/Button';
import { useSelector } from 'react-redux';
import { BatchPutAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';
import SingleLineSensorCard from '../organisms/SingleLineSensorCard';

const SensorScreen = ({ navigation }) => {
  const [accelerometerData, setAccelerometerData] = useState([]);
  const [gyroscopeData, setGyroscopeData] = useState([]);
  const [magnetometerData, setMagnetometerData] = useState([]);
  const [barometerData, setBarometerData] = useState([]);

  const subscriptionAccelerometer = useRef(null);
  const subscriptionGyroscope = useRef(null);
  const subscriptionMagnetometer = useRef(null);
  const subscriptionBarometer = useRef(null);

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
              {
                entryId: 'AccelerometerXMeasurement',
                propertyAlias: qrData.AssetModelAccelerometerXMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.x },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
              {
                entryId: 'AccelerometerYMeasurement',
                propertyAlias: qrData.AssetModelAccelerometerYMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.y },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
              {
                entryId: 'AccelerometerZMeasurement',
                propertyAlias: qrData.AssetModelAccelerometerZMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.z },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
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
              {
                entryId: 'GyroscopeXMeasurement',
                propertyAlias: qrData.AssetModelGyroscopeXMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.x },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
              {
                entryId: 'GyroscopeYMeasurement',
                propertyAlias: qrData.AssetModelGyroscopeYMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.y },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
              {
                entryId: 'GyroscopeZMeasurement',
                propertyAlias: qrData.AssetModelGyroscopeZMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.z },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
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
              {
                entryId: 'MagnetometerXMeasurement',
                propertyAlias: qrData.AssetModelMagnetometerXMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.x },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
              {
                entryId: 'MagnetometerYMeasurement',
                propertyAlias: qrData.AssetModelMagnetometerYMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.y },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
              {
                entryId: 'MagnetometerZMeasurement',
                propertyAlias: qrData.AssetModelMagnetometerZMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.z },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
            ],
          });
          client?.send(command);
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
              {
                entryId: 'AssetModelBarometerMeasurement',
                propertyAlias: qrData.AssetModelBarometerMeasurement,
                propertyValues: [
                  {
                    value: { doubleValue: data.pressure },
                    timestamp: { timeInSeconds: Date.now() / 1000 },
                  },
                ],
              },
            ],
          });
          client?.send(command);
        }
      },
      error: error => console.log('The sensor is not available', error),
    });
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
  const stopBarometer = () => {
    subscriptionBarometer.current.unsubscribe();
  };

  useEffect(() => {
    startAccelerometer();
    return () => {
      stopAccelerometer();
      stopGyroscope();
      stopMagnetometer();
      stopBarometer();
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
    <ScrollView>
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
      <CameraSensorCard title={'Video'} />
      <SingleLineSensorCard
        sensorData={barometerData}
        title={'Barometer'}
        startSensor={startBarometer}
        stopSensor={stopBarometer}
      />
    </ScrollView>
  );
};

export default SensorScreen;
