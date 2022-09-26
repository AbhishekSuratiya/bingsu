import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import SensorCard from '../organisms/SensorCard';
import {
  accelerometer,
  gyroscope,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import CameraSensorCard from '../organisms/CameraSensorCard';
import styles from './SensorScreenStyles';
import { AwsContext } from '../../containers/InitialiseAws';
import { AWS_TOPIC_NAME } from '../../utils/contants';

const SensorScreen = props => {
  const [accelerometerData, setAccelerometerData] = useState([]);
  const [gyroscopeData, setGyroscopeData] = useState([]);
  const [magnetometerData, setMagnetometerData] = useState([]);

  const subscriptionAccelerometer = useRef(null);
  const subscriptionGyroscope = useRef(null);
  const subscriptionMagnetometer = useRef(null);

  const client = useContext(AwsContext);

  const startAccelerometer = () => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
    subscriptionAccelerometer.current = accelerometer.subscribe({
      next: data => {
        setAccelerometerData(prev => [...prev.slice(-20), data]);
        client &&
          client.publish(
            AWS_TOPIC_NAME,
            JSON.stringify({
              state: {
                reported: {
                  AccelerometerXMeasurement: data.x,
                  AccelerometerYMeasurement: data.y,
                  AccelerometerZMeasurement: data.z,
                },
              },
            }),
          );
      },
      error: error => console.log('The sensor is not available', error),
    });
  };
  const startGyroscope = () => {
    setUpdateIntervalForType(SensorTypes.gyroscope, 1000);
    subscriptionGyroscope.current = gyroscope.subscribe({
      next: data => {
        setGyroscopeData(prev => [...prev.slice(-20), data]);
        client &&
          client.publish(
            AWS_TOPIC_NAME,
            JSON.stringify({
              state: {
                reported: {
                  GyroscopeXMeasurement: data.x,
                  GyroscopeYMeasurement: data.y,
                  GyroscopeZMeasurement: data.z,
                },
              },
            }),
          );
      },
      error: error => console.log('The sensor is not available', error),
    });
  };
  const startMagnetometer = () => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
    subscriptionMagnetometer.current = magnetometer.subscribe({
      next: data => {
        setMagnetometerData(prev => [...prev.slice(-20), data]);
        client &&
          client.publish(
            AWS_TOPIC_NAME,
            JSON.stringify({
              state: {
                reported: {
                  MagnetometerXMeasurement: data.x,
                  MagnetometerYMeasurement: data.y,
                  MagnetometerZMeasurement: data.z,
                },
              },
            }),
          );
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

  useEffect(() => {
    startAccelerometer();
    startGyroscope();
    startMagnetometer();

    return () => {
      stopAccelerometer();
      stopGyroscope();
      stopMagnetometer();
    };
  }, []);

  return (
    <ScrollView>
      <SensorCard
        sensorData={accelerometerData}
        title={'Accelerometer'}
        startSensor={startAccelerometer}
        stopSensor={stopAccelerometer}
        style={styles.sensorCard}
      />
      <SensorCard
        sensorData={gyroscopeData}
        title={'Gyroscope'}
        startSensor={startGyroscope}
        stopSensor={stopGyroscope}
        style={styles.sensorCard}
      />
      <SensorCard
        sensorData={magnetometerData}
        title={'Magnetometer'}
        startSensor={startMagnetometer}
        stopSensor={stopMagnetometer}
        style={styles.sensorCard}
      />
      <CameraSensorCard title={'Video'} />
    </ScrollView>
  );
};

export default SensorScreen;
