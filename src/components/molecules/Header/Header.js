import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './HeaderStyles';
const Header = ({ navigation, options }) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={navigation.goBack} style={styles.back}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{options.title}</Text>
    </View>
  );
};

export default Header;
