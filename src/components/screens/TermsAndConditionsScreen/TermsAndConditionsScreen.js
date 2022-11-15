import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import styles from './TermsAndConditionsScreenStyles';
import { TERMS_N_CONDITIONS } from '../../../utils/contants';

const TermsAndConditionsScreen = () => {
  const [tncText, setTncText] = useState('');

  useEffect(() => {
    fetch(TERMS_N_CONDITIONS)
      .then(response => response.text())
      .then(response => setTncText(response));
  }, []);

  return (
    <ScrollView style={styles.root}>
      <Markdown>{tncText}</Markdown>
    </ScrollView>
  );
};

export default TermsAndConditionsScreen;
