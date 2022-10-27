import React from 'react';
import styles from './NoInternetToastStyles';
import { Text, TouchableOpacity, View } from 'react-native';

const NoInternetToast = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.somethingWrongTxt}>
        {'Something went wrong. Please check your internet connection.'}
      </Text>
      <TouchableOpacity style={styles.retryBtn}>
        <Text style={styles.retryTxt}>{'Retry'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoInternetToast;
