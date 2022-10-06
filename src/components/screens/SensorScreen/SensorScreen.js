import React, { useContext, useRef, useState } from 'react';
import { DeviceEventEmitter, ScrollView, Text, View } from 'react-native';
import styles from './SensorScreenStyles';
import { AwsContext } from '../../../containers/InitialiseAws';
import Button from '../../atoms/Button';
import { useSelector } from 'react-redux';
import LocationSensorMap from '../../organisms/LocationSensorMap/LocationSensorMap';
import {
  startLightSensor,
  stopLightSensor,
} from 'react-native-ambient-light-sensor';
import BulbSvg from '../../../../assets/images/svg/bulbSvg';
import Colors from '../../../theme/Colors';
import AccelerometerSensor from '../../organisms/AccelerometerSensor/AccelerometerSensor';
import GyroscopeSensor from '../../organisms/GyroscopeSensor/GyroscopeSensor';
import MagnetometerSensor from '../../organisms/MagnetometerSensor/MagnetometerSensor';
import CameraSensorCard from '../../organisms/CameraSensorCard/CameraSensorCard';
import OrientationSensor from '../../organisms/OrientationSensor/OrientationSensor';
import AltitudeSensor from '../../organisms/AltitudeSensor/AltitudeSensor';
import ProximitySensor from '../../organisms/ProximitySensor/ProximitySensor';
import BarometerSensor from '../../organisms/BarometerSensor/BarometerSensor';

const SensorScreen = ({ navigation }) => {
  const [ambientLightData, setAmbientLightData] = useState([]);
  const [isBarometerAvailable, setIsBarometerAvailable] = useState(true);
  const subscriptionAmbientLight = useRef(null);
  const client = useContext(AwsContext);
  const { isAwsConnected, qrData } = useSelector(state => state.awsStore);
  const startAmbientLight = () => {
    startLightSensor();
    subscriptionAmbientLight.current = DeviceEventEmitter.addListener(
      'LightSensor',
      data => {
        setAmbientLightData(prev => [...prev.slice(-20), data.lightValue]);
      },
    );
  };
  const stopAmbientLight = () => {
    stopLightSensor();
    subscriptionAmbientLight.current?.remove();
  };

  const renderConnectToAwsCard = () => {
    return (
      <View style={styles.connectToAwsSpacing}>
        <View style={styles.connectToAwsWrapper}>
          <View style={styles.connectToAwsTitle}>
            <View style={styles.bulbIcon}>
              <BulbSvg fill={Colors.blue} />
            </View>
            <View>
              <Text style={styles.connectToAws}>Connect to AWS</Text>
              <Text style={styles.saveYourData}>
                Save your sensor data by connecting to AWS
              </Text>
            </View>
          </View>
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
      <AccelerometerSensor />
      <GyroscopeSensor />
      <MagnetometerSensor />
      <OrientationSensor />
      <CameraSensorCard title={'Video'} />
      <LocationSensorMap title={'GPS'} />
      {isBarometerAvailable && (
        <BarometerSensor setIsBarometerAvailable={setIsBarometerAvailable} />
      )}
      <AltitudeSensor />
      <ProximitySensor />
      {/*TODO:Need to enable this once ios is also ready*/}
      {/*{Platform.OS === 'android' && (*/}
      {/*  <SingleLineSensorCard*/}
      {/*    sensorData={ambientLightData}*/}
      {/*    title={'Ambient Light'}*/}
      {/*    startSensor={startAmbientLight}*/}
      {/*    stopSensor={stopAmbientLight}*/}
      {/*    units={'lux'}*/}
      {/*    toFixed={1}*/}
      {/*  />*/}
      {/*)}*/}
    </ScrollView>
  );
};

export default SensorScreen;
