import React, { useState } from 'react';
import Colors from '../../theme/Colors';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import styles from './CameraSensorCardStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../utils/contants';

const CameraSensorCard = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  React.useEffect(() => {
    if (isSensorListening) {
      (async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      })();
    }
  }, [isSensorListening]);
  return (
    <View style={styles.root}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={SENSOR_CARD_HEADER}
        enablePointerEvents>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Switch
              trackColor={{ false: '#787880', true: Colors.blue }}
              thumbColor={'white'}
              onValueChange={() => setIsSensorListening(val => !val)}
              value={isSensorListening}
            />
          </View>
          <View style={styles.cameraWrapper}>
            {device != null && hasPermission && (
              <>
                <Camera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={isSensorListening}
                />
              </>
            )}
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default CameraSensorCard;
