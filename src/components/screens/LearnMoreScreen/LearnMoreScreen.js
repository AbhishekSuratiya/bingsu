import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { LEARN_MORE_LINK } from '../../../utils/contants';

const LearnMoreScreen = () => {
  useEffect(() => {
    Linking.openURL(LEARN_MORE_LINK);
  }, []);
  return null;
};

export default LearnMoreScreen;
