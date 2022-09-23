import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './HeaderStyles';
const Header = ({ navigation, options }) => {
  return (
    <View style={styles.mainContainer}>
      {/*<TouchableOpacity onPress={navigation.goBack} style={styles.back}>*/}
      {/*  <Text style={{ color: 'black' }}>Back</Text>*/}
      {/*</TouchableOpacity>*/}
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.title}>{options.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.dot} />
          <Text style={styles.connectionStatus}>{'Connected to AWS'}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
