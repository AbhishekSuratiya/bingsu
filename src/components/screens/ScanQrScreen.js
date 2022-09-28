import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import Colors from '../../theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { awsAction } from '../../redux/reducers/awsReducer';
import Button from '../atoms/Button';
import { CheckSvg } from '../../../assets/images/svg';
import isJsonString from '../../utils/isJsonString';

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

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    if (barcodes.length && barcodes[0].displayValue && isCameraActive) {
      const { REGION, COGNITO_POOL_ID, COGNITO_UNAUTH_ROLE_ARN } =
        isJsonString(barcodes[0].displayValue) &&
        JSON.parse(barcodes[0].displayValue);
      if (REGION && COGNITO_POOL_ID && COGNITO_UNAUTH_ROLE_ARN) {
        setIsCameraActive(false);
        dispatch(awsAction.setQrData(JSON.parse(barcodes[0].displayValue)));
      }
      dispatch(awsAction.setAwsRegion(REGION));
      dispatch(awsAction.setCognitoIdentityPool(COGNITO_POOL_ID));
      dispatch(awsAction.setRoleArn(COGNITO_UNAUTH_ROLE_ARN));
    }
  }, [barcodes]);

  const disconnectFromAws = () => {
    setIsCameraActive(true);
    dispatch(awsAction.setQrData({}));
    dispatch(awsAction.setAwsRegion(''));
    dispatch(awsAction.setCognitoIdentityPool(''));
    dispatch(awsAction.setRoleArn(''));
    dispatch(awsAction.setIsAwsConnected(false));
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
