import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/screens/HomeScreen';
import Header from '../components/molecules/Header/Header';
import SensorScreen from '../components/screens/SensorScreen';
import ScanQrScreen from '../components/screens/ScanQrScreen';

const Stack = createNativeStackNavigator();

const screens = [
  {
    name: 'Home',
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: 'Sensor',
    component: SensorScreen,
  },
  {
    name: 'ScanQr',
    component: ScanQrScreen,
    options: { title: 'Scan QR Code' },
  },
];

const screenOptions = () => ({
  header: props => <Header {...props} />,
});

const navigationTheme = {
  colors: {
    primary: 'black',
    text: 'black',
    background: 'white',
  },
};

const Navigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName={'Home'}>
          {screens.map(({ name, component, options }) => {
            return (
              <Stack.Screen
                key={name}
                name={name}
                component={component}
                options={options}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default Navigator;
