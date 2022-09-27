import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
import {
  AWS_SEND_MESSAGE_INTERVAL,
  AWS_TOPIC_NAME,
} from '../../utils/contants';
import Button from '../atoms/Button';
import { useSelector } from 'react-redux';

const SensorScreen = ({ navigation }) => {
  const [accelerometerData, setAccelerometerData] = useState([]);
  const [gyroscopeData, setGyroscopeData] = useState([]);
  const [magnetometerData, setMagnetometerData] = useState([]);

  const subscriptionAccelerometer = useRef(null);
  const subscriptionGyroscope = useRef(null);
  const subscriptionMagnetometer = useRef(null);

  const client = useContext(AwsContext);
  const isAwsConnected = useSelector(state => state.awsStore.isAwsConnected);

  const startAccelerometer = () => {
    setUpdateIntervalForType(
      SensorTypes.accelerometer,
      AWS_SEND_MESSAGE_INTERVAL,
    );
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
    setUpdateIntervalForType(SensorTypes.gyroscope, AWS_SEND_MESSAGE_INTERVAL);
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
    setUpdateIntervalForType(
      SensorTypes.magnetometer,
      AWS_SEND_MESSAGE_INTERVAL,
    );
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
    return () => {
      stopAccelerometer();
      stopGyroscope();
      stopMagnetometer();
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
