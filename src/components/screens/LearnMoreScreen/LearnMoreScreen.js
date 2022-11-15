import React, { useContext } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { LEARN_MORE_LINK } from '../../../utils/contants';
import { LoggerContext } from '../../../containers/Logger';
import styles from './LearnMoreScreenStyles';

const LearnMoreScreen = ({ navigation }) => {
  const cloudWatchLog = useContext(LoggerContext);

  return (
    <View style={styles.root}>
      <TouchableOpacity
        onPress={() => {
          cloudWatchLog('Opening AWS IoT URL');
          Linking.openURL(LEARN_MORE_LINK);
        }}>
        <Text style={styles.awsIot}>AWS IoT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TermsAndConditions');
          cloudWatchLog('Navigated to Terms and Conditions Screen');
        }}>
        <Text style={styles.tnc}>Terms & Condition</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LearnMoreScreen;
