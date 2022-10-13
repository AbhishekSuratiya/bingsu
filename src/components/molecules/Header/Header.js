import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import styles from './HeaderStyles';
import { useSelector } from 'react-redux';

const Header = ({ options }) => {
  const animation = useRef(new Animated.Value(1)).current;
  const { isAwsConnected, isScanning, isConnecting } = useSelector(
    state => state.awsStore,
  );

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 6,
          duration: 1000,
          useNativeDriver: false,
        }),
        {
          iterations: -1,
        },
      ).start();
    }
  }, [isScanning, animation]);

  const renderHeader = () => {
    return isScanning || isConnecting ? (
      <>
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.animatedDot,
              {
                width: animation,
                height: animation,
              },
            ]}
          />
        </View>
        <Text style={styles.connectionStatus}>
          {isScanning ? 'Scanning' : 'Connecting'}
        </Text>
      </>
    ) : (
      <>
        <View style={[styles.dot, !isAwsConnected && styles.dotDisConnected]} />
        <Text style={styles.connectionStatus}>
          {isAwsConnected ? 'Connected to AWS' : 'Not Connected to AWS'}
        </Text>
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.title}>{options.title}</Text>
        <View style={styles.connectionStatusWrapper}>{renderHeader()}</View>
      </View>
    </View>
  );
};

export default Header;
