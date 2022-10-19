import React, { useEffect, useMemo, useState } from 'react';
import Colors from '../../../theme/Colors';
import {
  ActivityIndicator,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './CameraSensorCardStyles';
import Collapsible from 'react-native-collapsible';
import { CAMERA_VIEW, SENSOR_CARD_HEADER } from '../../../utils/contants';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Button from '../../atoms/Button';
import { CameraSvg } from '../../../../assets/images/svg';
import { openSettings } from 'react-native-permissions';

const { rear, front } = CAMERA_VIEW;
const CameraSensorCard = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(rear);
  const { isAwsConnected, qrData, secretAccessKey, sessionToken, accessKeyId } =
    useSelector(state => state.awsStore);
  const script = useMemo(() => {
    return `
            formValues.channelName = '${qrData.KinesisVideoChannelName}'
            formValues.region = '${qrData.REGION}'
            formValues.accessKeyId = '${accessKeyId}'
            formValues.secretAccessKey = '${secretAccessKey}'
            formValues.sessionToken = '${sessionToken}'
            constraints.video = {
                                  facingMode: '${cameraFacing}',
                                  width: { ideal: 720 },
                                  height: { ideal: 1280 },
                                }
            startMasterStream()`;
  }, [qrData, accessKeyId, secretAccessKey, sessionToken, cameraFacing]);

  const sourceUri =
    (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
    'Web.bundle/index.html';
  const devices = useCameraDevices();
  const device = cameraFacing === front ? devices.front : devices.back;

  useEffect(() => {
    if (isSensorListening) {
      (async () => {
        const status = await Camera.requestCameraPermission();
        check(PERMISSIONS.IOS.CAMERA).then(result => {
          if (result === RESULTS.BLOCKED) {
            if (!isBlocked) {
              setIsSensorListening(false);
            }
            setIsBlocked(true);
          }
        });
        setHasPermission(status === 'authorized');
        if (status === 'denied' && Platform.OS === 'android') {
          setIsSensorListening(false);
        }
      })();
    }
  }, [isSensorListening]);

  const renderCamera = () => {
    if (device != null && hasPermission && !isAwsConnected) {
      return (
        <Camera
          style={styles.webView}
          device={device}
          isActive={isSensorListening}
        />
      );
    }
    if (
      isSensorListening &&
      accessKeyId &&
      secretAccessKey &&
      sessionToken &&
      isAwsConnected
    ) {
      return (
        <WebView
          key={cameraFacing}
          source={{ uri: sourceUri }}
          geolocationEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          injectedJavaScript={script}
          containerStyle={styles.webView}
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
          scrollEnabled={false}
        />
      );
    }
    return (
      <ActivityIndicator
        style={styles.spinner}
        color={Colors.blue}
        size="large"
      />
    );
  };

  const renderCameraSwitchBtn = () => {
    return (
      <View style={styles.switchCameraWrapper}>
        <TouchableOpacity
          style={[
            styles.switchCameraButton,
            {
              backgroundColor:
                cameraFacing === rear ? Colors.grey : Colors.transparent,
            },
          ]}
          onPress={() => setCameraFacing(rear)}>
          <Text style={styles.cameraBtnText}>{'Back Camera'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchCameraButton,
            {
              backgroundColor:
                cameraFacing === front ? Colors.grey : Colors.transparent,
            },
          ]}
          onPress={() => setCameraFacing(front)}>
          <Text style={styles.cameraBtnText}>{'Front Camera'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const openPermissionSettings = () => {
    openSettings().catch(() => console.warn('Cannot open settings'));
  };

  const renderOpenSettings = () => (
    <View style={styles.allowCard}>
      <CameraSvg />
      <Text style={styles.allowText}>
        {'Allow AWS IoT Bingsu to access\nyour camera'}
      </Text>
      <Text style={styles.allowTextDesc}>
        {'This lets you view video sensor data'}
      </Text>
      <Button light title={'Open Settings'} onPress={openPermissionSettings} />
    </View>
  );

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
              trackColor={{ false: Colors.toggleOff, true: Colors.blue }}
              thumbColor={Colors.white100}
              onValueChange={() => {
                setIsSensorListening(val => !val);
              }}
              value={isSensorListening}
            />
          </View>
          {isBlocked ? (
            renderOpenSettings()
          ) : (
            <>
              {isSensorListening && renderCameraSwitchBtn()}
              <View style={styles.cameraWrapper}>{renderCamera()}</View>
            </>
          )}
        </View>
      </Collapsible>
    </View>
  );
};

export default CameraSensorCard;
