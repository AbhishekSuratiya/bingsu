import React from 'react';
import WebView from 'react-native-webview';
import { LEARN_MORE_LINK } from '../../../utils/contants';
import { ActivityIndicator } from 'react-native';
import Colors from '../../../theme/Colors';

const LearnMoreScreen = () => (
  <WebView
    source={{ uri: LEARN_MORE_LINK }}
    renderLoading={() => {
      return <ActivityIndicator color={Colors.blue} size="large" />;
    }}
  />
);

export default LearnMoreScreen;
