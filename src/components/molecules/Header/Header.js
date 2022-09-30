import React from 'react';
import { Text, View } from 'react-native';
import styles from './HeaderStyles';
import { useSelector } from 'react-redux';

const Header = ({ options }) => {
  const isAwsConnected = useSelector(state => state.awsStore.isAwsConnected);

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.title}>{options.title}</Text>
        <View style={styles.connectionStatusWrapper}>
          <View
            style={[styles.dot, !isAwsConnected && styles.dotDisConnected]}
          />
          <Text style={styles.connectionStatus}>
            {isAwsConnected ? 'Connected to AWS' : 'Not Connected to AWS'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
