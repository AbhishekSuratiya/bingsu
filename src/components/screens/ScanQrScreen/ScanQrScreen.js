import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { useDispatch, useSelector } from 'react-redux';
import { awsAction } from '../../../redux/reducers/awsReducer';
import Button from '../../atoms/Button';
import { CheckSvg } from '../../../../assets/images/svg';
import isJsonString from '../../../utils/isJsonString';
import styles from './ScanQrScreenStyles';
import Bullet from '../../atoms/Bullet/Bullet';
import { SETUP_INSTRUCTIONS } from '../../../utils/contants';

export default function ScanQrScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const { isAwsConnected, isScanning } = useSelector(state => state.awsStore);
  const dispatch = useDispatch();
  const devices = useCameraDevices();
  const device = devices.back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(() => {
    if (device != null && hasPermission && !isAwsConnected && !isScanning) {
      dispatch(awsAction.setIsScanning(true));
    }

    return () => {
      isScanning && dispatch(awsAction.setIsScanning(false));
    };
  }, [device, hasPermission, isAwsConnected, isScanning]);

  useEffect(() => {
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
    dispatch(awsAction.setAccessKeyId(null));
    dispatch(awsAction.setSessionToken(null));
    dispatch(awsAction.setSecretAccessKey(null));
  };

  if (isAwsConnected) {
    return (
      <View style={styles.connectedWrapper}>
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
  } else if (device != null && hasPermission) {
    return (
      <>
        <Camera
          style={styles.cameraRoot}
          device={device}
          isActive={isCameraActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        <View style={styles.stepsWrapper}>
          <Text style={styles.barcodeHeading}>{'How to connect to AWS?'}</Text>
          {SETUP_INSTRUCTIONS.map((e, i) => (
            <Bullet number={i + 1} style={styles.bullets} key={i}>
              <Text style={styles.steps}>{e}</Text>
            </Bullet>
          ))}
        </View>
      </>
    );
  } else {
    return null;
  }
}
