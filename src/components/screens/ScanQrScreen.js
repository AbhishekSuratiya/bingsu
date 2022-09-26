import * as React from 'react';

import { StyleSheet, Text } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Colors from '../../theme/Colors';

export default function ScanQrScreen() {
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
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={{
            width: '100%',
            height: 350,
            borderWidth: 1,
            borderColor: 'red',
          }}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {barcodes.map((barcode, idx) => (
          <Text key={idx} style={styles.barcodeTextURL}>
            {barcode.displayValue}
          </Text>
        ))}
        <Text style={styles.barcodeHeading}>{'How to connect to AWS?'}</Text>
        <Text style={styles.steps}>
          {'1. Create an account on aws.amazon.com'}
        </Text>
        <Text style={styles.steps}>{'2. Go to sensors dashboard'}</Text>
        <Text style={styles.steps}>{'3. Click the generate QR button'}</Text>
        <Text style={styles.steps}>{'4. Scan the QR with the app'}</Text>
      </>
    )
  );
}

const styles = StyleSheet.create({
  barcodeHeading: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 16,
  },
  steps: {
    fontSize: 13,
    color: Colors.grey80,
    marginBottom: 12,
  },
});
