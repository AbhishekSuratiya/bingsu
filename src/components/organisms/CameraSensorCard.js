import React, { useState } from 'react';
import Colors from '../../theme/Colors';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Fonts from '../../theme/Fonts';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import styles from './SensorCardStyles';
import Collapsible from 'react-native-collapsible';

const CameraSensorCard = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  return (
    <View style={{ height: 360, padding: 16, width: '100%' }}>
      <Collapsible
        style={styles.card}
        collapsed={!isSensorListening}
        collapsedHeight={66}
        enablePointerEvents>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.dark5,
            borderRadius: 8,
            overflow: 'hidden',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              justifyContent: 'space-between',
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={{
                  color: Colors.white100,
                  fontSize: 16,
                  fontFamily: Fonts.icomoon,
                }}>
                {title}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{ false: '#787880', true: Colors.blue }}
                thumbColor={'white'}
                onValueChange={() => setIsSensorListening(val => !val)}
                value={isSensorListening}
              />
            </View>
          </View>
          <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
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
