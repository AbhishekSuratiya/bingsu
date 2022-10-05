import React from 'react';
import WebView from 'react-native-webview';
import { LEARN_MORE_LINK } from '../../../utils/contants';

const LearnMoreScreen = () => <WebView source={{ uri: LEARN_MORE_LINK }} />;

export default LearnMoreScreen;
