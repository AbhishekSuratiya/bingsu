import React, { useEffect, useMemo, useState } from 'react';
import Colors from '../../../theme/Colors';
import { ActivityIndicator, Platform, Switch, Text, View } from 'react-native';
import styles from './CameraSensorCardStyles';
import Collapsible from 'react-native-collapsible';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraSensorCard = ({ title }) => {
  const [isSensorListening, setIsSensorListening] = useState(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const { isAwsConnected, qrData, secretAccessKey, sessionToken, accessKeyId } =
    useSelector(state => state.awsStore);
  const script = useMemo(() => {
    return `
            formValues.channelName = '${qrData.KinesisVideoChannelName}'
            formValues.region = '${qrData.REGION}'
            formValues.accessKeyId = '${accessKeyId}'
            formValues.secretAccessKey = '${secretAccessKey}'
            formValues.sessionToken = '${sessionToken}'
            startMasterStream()`;
  }, [qrData, accessKeyId, secretAccessKey, sessionToken]);

  const sourceUri =
    (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
    'Web.bundle/index.html';
  const devices = useCameraDevices();
  const device = devices.front;

  useEffect(() => {
    if (isSensorListening) {
      (async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
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
          <View style={styles.cameraWrapper}>{renderCamera()}</View>
        </View>
      </Collapsible>
    </View>
  );
};

export default CameraSensorCard;
