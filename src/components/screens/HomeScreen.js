import React from 'react';
import { Button, Text } from 'react-native';

const HomeScreen = props => {
  return (
    <>
      <Text>HomeScreen</Text>
      <Button
        title={'GoTo About Screen'}
        onPress={() => props.navigation.navigate('About')}
      />
    </>
  );
};

export default HomeScreen;
