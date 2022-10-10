import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import styles from './SensorScreenStyles';
import Button from '../../atoms/Button';
import { useSelector } from 'react-redux';
import LocationSensorMap from '../../organisms/LocationSensorMap/LocationSensorMap';
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
import AmbientLightSensor from '../../organisms/AmbientLightSensor/AmbientLightSensor';

const SensorScreen = ({ navigation }) => {
  const [isBarometerAvailable, setIsBarometerAvailable] = useState(true);
  const { isAwsConnected } = useSelector(state => state.awsStore);

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
            light
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
      <AmbientLightSensor />
    </ScrollView>
  );
};

export default SensorScreen;
