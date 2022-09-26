import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './HeaderStyles';
import { useSelector } from 'react-redux';
import Colors from '../../../theme/Colors';
const Header = ({ navigation, options }) => {
  const isAwsConnected = useSelector(state => state.awsStore.isAwsConnected);

  return (
    <View style={styles.mainContainer}>
      {/*<TouchableOpacity onPress={navigation.goBack} style={styles.back}>*/}
      {/*  <Text style={{ color: 'black' }}>Back</Text>*/}
      {/*</TouchableOpacity>*/}
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.title}>{options.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={[
              styles.dot,
              !isAwsConnected && { backgroundColor: Colors.red },
            ]}
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
