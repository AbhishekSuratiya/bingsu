import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Switch, Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { useDispatch, useSelector } from 'react-redux';
import { awsAction } from '../../../redux/reducers/awsReducer';
import Button from '../../atoms/Button';
import { CameraSvg, CheckSvg } from '../../../../assets/images/svg';
import isJsonString from '../../../utils/isJsonString';
import styles from './ScanQrScreenStyles';
import Bullet from '../../atoms/Bullet/Bullet';
import { SETUP_INSTRUCTIONS } from '../../../utils/contants';
import Colors from '../../../theme/Colors';
import Lottie from 'lottie-react-native';
import Success from '../../../../assets/images/json/success.json';
import Fail from '../../../../assets/images/json/fail.json';
import Loading from '../../../../assets/images/json/loading.json';
import { removeData, storeData } from '../../../utils/asyncStorage';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { LoggerContext } from '../../../containers/Logger';

export default function ScanQrScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isValidQr, setIsValidQr] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isToggleEnable, setIsToggleEnabled] = useState(true);
  const {
    isAwsConnected,
    isScanning,
    isConnecting,
    secretAccessKey,
    sessionToken,
    accessKeyId,
    isLoggingEnabled,
    qrData,
  } = useSelector(state => state.awsStore);
  const dispatch = useDispatch();
  const devices = useCameraDevices();
  const device = devices.back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const cloudWatchLog = useContext(LoggerContext);

  useEffect(() => {
    if (accessKeyId && secretAccessKey && sessionToken) {
      cloudWatchLog('Connected to AWS');
    }
  }, [accessKeyId, secretAccessKey, sessionToken]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status === 'authorized') {
        setHasPermission(true);
        cloudWatchLog('Camera permission granted');
      } else {
        setHasPermission(false);
        cloudWatchLog('Camera permission denied');
      }
      check(PERMISSIONS.IOS.CAMERA).then(result => {
        if (result === RESULTS.BLOCKED) {
          setIsBlocked(true);
          cloudWatchLog('Camera permission blocked');
        }
      });
    })();
    return () => {
      dispatch(awsAction.setIsScanning(false));
    };
  }, []);

  useEffect(() => {
    if (device != null && hasPermission && !isAwsConnected) {
      dispatch(awsAction.setIsScanning(true));
      cloudWatchLog('Scanning started');
    }
  }, [device, hasPermission, isAwsConnected]);

  useEffect(() => {
    if (barcodes.length && barcodes[0].displayValue && isCameraActive) {
      const { REGION, COGNITO_POOL_ID, COGNITO_UNAUTH_ROLE_ARN } =
        isJsonString(barcodes[0].displayValue) &&
        JSON.parse(barcodes[0].displayValue);
      if (REGION && COGNITO_POOL_ID && COGNITO_UNAUTH_ROLE_ARN) {
        dispatch(awsAction.setIsScanning(false));
        dispatch(awsAction.setIsConnecting(true));
        cloudWatchLog('Valid QR Code scanned and Scanning stopped');
        setIsCameraActive(false);
        setIsValidQr(true);
        dispatch(awsAction.setQrData(JSON.parse(barcodes[0].displayValue)));
        dispatch(awsAction.setAwsRegion(REGION));
        dispatch(awsAction.setCognitoIdentityPool(COGNITO_POOL_ID));
        dispatch(awsAction.setRoleArn(COGNITO_UNAUTH_ROLE_ARN));
        storeData('qrCode', barcodes[0].displayValue);
      } else {
        dispatch(awsAction.setIsScanning(false));
        setIsCameraActive(false);
        setIsValidQr(false);
        cloudWatchLog('Invalid QR code scanned');

        setTimeout(() => {
          dispatch(awsAction.setIsScanning(true));
          cloudWatchLog('Scanning started');
          setIsCameraActive(true);
        }, 5000);
      }
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
    removeData('qrCode');
    cloudWatchLog('Disconnected form AWS');
  };
  const openPermissionSettings = () => {
    cloudWatchLog('Opening permission settings');
    openSettings().catch(() => console.warn('Cannot open settings'));
  };
  const renderOpenSettings = () => {
    return (
      <View style={styles.allowCard}>
        <CameraSvg />
        <Text style={styles.allowText}>
          {'Allow AWS IoT Bingsu to access\nyour camera'}
        </Text>
        <Text style={styles.allowTextDesc}>
          {'This lets you scan the QR code and connect to web dashboard'}
        </Text>
        <Button
          light
          title={'Open Settings'}
          onPress={openPermissionSettings}
        />
      </View>
    );
  };
  const renderInstructions = () => {
    return (
      <View style={styles.stepsWrapper}>
        <Text style={styles.barcodeHeading}>{'How to connect to AWS?'}</Text>
        {SETUP_INSTRUCTIONS.map((e, i) => (
          <Bullet number={i + 1} style={styles.bullets} key={i}>
            <Text style={styles.steps}>{e}</Text>
          </Bullet>
        ))}
      </View>
    );
  };

  const disableLogging = () => {
    setIsToggleEnabled(false);
    fetch(qrData?.LOGGING_TOGGLE_URL + '?disable')
      .then(res => res.json())
      .then(json => {
        console.log(json);
        cloudWatchLog('Logging disabled');
        dispatch(awsAction.setLoggingEnabled(false));
        setIsToggleEnabled(true);
      });
  };

  const enableLogging = () => {
    setIsToggleEnabled(false);
    fetch(qrData?.LOGGING_TOGGLE_URL + '?enable')
      .then(res => res.json())
      .then(json => {
        console.log(json);
        cloudWatchLog('Logging enabled');
        dispatch(awsAction.setLoggingEnabled(true));
        setIsToggleEnabled(true);
      });
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
          <View style={styles.loggerWrapper}>
            <Text style={styles.loggerTxt}>{'Enable logs'}</Text>
            {isToggleEnable ? (
              <Switch
                disabled={!isToggleEnable}
                trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
                thumbColor={Colors.white100}
                onValueChange={() => {
                  isLoggingEnabled ? disableLogging() : enableLogging();
                }}
                value={isLoggingEnabled}
              />
            ) : (
              <ActivityIndicator
                style={styles.activityIndicator}
                color={Colors.blue}
              />
            )}
          </View>
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
        <View style={styles.cameraOverlay}>
          <View
            style={[
              styles.animation,
              {
                borderColor: isScanning
                  ? Colors.green
                  : !isValidQr && Colors.red2,
              },
            ]}>
            {(!isScanning || isConnecting) && (
              <Lottie
                source={isConnecting ? Loading : isValidQr ? Success : Fail}
                autoPlay
                style={styles.animatedIcon}
                loop={isConnecting}
              />
            )}
          </View>
        </View>
        {renderInstructions()}
      </>
    );
  } else if (isBlocked) {
    return (
      <>
        {renderOpenSettings()}
        {renderInstructions()}
      </>
    );
  } else {
    return null;
  }
}
