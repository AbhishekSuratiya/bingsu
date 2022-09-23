import React, { useState } from 'react';
import Colors from '../../theme/Colors';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Fonts from '../../theme/Fonts';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';

const CameraSensorCard = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(true);
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  return (
    <View style={{ height: 360, padding: 16, width: '100%' }}>
      <View
        style={{
          padding: 16,
          flex: 1,
          backgroundColor: Colors.dark5,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 16,
            justifyContent: 'space-between',
          }}>
          <View>
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
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
              />
              {barcodes.map((barcode, idx) => (
                <Text key={idx} style={styles.barcodeTextURL}>
                  {barcode.displayValue}
                </Text>
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default CameraSensorCard;

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 12,
    color: Colors.red,
    fontWeight: 'bold',
  },
});
