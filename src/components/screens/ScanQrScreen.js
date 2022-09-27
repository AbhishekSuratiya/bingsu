import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Colors from '../../theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { awsAction } from '../../redux/reducers/awsReducer';
import Button from '../atoms/Button';
import { AwsContext } from '../../containers/InitialiseAws';
import { AWS_TOPIC_NAME } from '../../utils/contants';
import { CheckSvg } from '../../../assets/images/svg';

export default function ScanQrScreen({ navigation }) {
  const [hasPermission, setHasPermission] = React.useState(false);
  const isAwsConnected = useSelector(state => state.awsStore.isAwsConnected);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const devices = useCameraDevices();
  const device = devices.back;
  const dispatch = useDispatch();
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const client = useContext(AwsContext);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    if (barcodes.length && barcodes[0].displayValue && isCameraActive) {
      const { REGION, COGNITO_POOL_ID } = JSON.parse(barcodes[0].displayValue);
      console.log({ REGION, COGNITO_POOL_ID }, '>>>>');
      setIsCameraActive(false);
      dispatch(awsAction.setAwsRegion(REGION));
      dispatch(awsAction.setCognitoIdentityPool(COGNITO_POOL_ID));
    }
  }, [barcodes]);

  const disconnectFromAws = () => {
    setIsCameraActive(true);
    dispatch(awsAction.setAwsRegion(''));
    dispatch(awsAction.setCognitoIdentityPool(''));
    client && client.end(AWS_TOPIC_NAME);
  };

  if (isAwsConnected) {
    return (
      <View style={{ padding: 16, flex: 1, paddingTop: 0 }}>
        <View style={styles.connectedContainer}>
          <CheckSvg />
          <Text style={styles.connected}>{'You are connected!'}</Text>
          <Button
            light
            title={'View Sensors'}
            onPress={() => navigation.navigate('Sensor')}
          />
        </View>
        <Button negative title={'Disconnect'} onPress={disconnectFromAws} />
      </View>
    );
  }

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={styles.cameraRoot}
          device={device}
          isActive={isCameraActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.barcodeHeading}>{'How to connect to AWS?'}</Text>
          <Text style={styles.steps}>
            {'1. Create an account on aws.amazon.com'}
          </Text>
          <Text style={styles.steps}>{'2. Go to sensors dashboard'}</Text>
          <Text style={styles.steps}>{'3. Click the generate QR button'}</Text>
          <Text style={styles.steps}>{'4. Scan the QR with the app'}</Text>
        </View>
      </>
    )
  );
}

const styles = StyleSheet.create({
  barcodeHeading: {
    fontSize: 16,
    color: Colors.white100,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 16,
  },
  steps: {
    fontSize: 13,
    color: Colors.grey80,
    marginBottom: 12,
  },
  connected: {
    fontSize: 18,
    color: Colors.white100,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 38,
  },
  connectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraRoot: {
    width: '100%',
    height: 350,
  },
});
