import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const ScanQrScreen = props => {
  const getPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log({ cameraPermission, newCameraPermission });
  };
  useEffect(() => {
    getPermission().then();
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;
  return (
    <View style={{ flex: 1 }}>
      {!!device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
      )}
    </View>
  );
};

export default ScanQrScreen;
