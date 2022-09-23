import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/screens/HomeScreen';
import Header from '../components/molecules/Header/Header';
import DevSensorScreen from '../components/screens/DevSensorScreen';
import ScanQrScreen from '../components/screens/ScanQrScreen';
import SensorScreen from '../components/screens/SensorScreen';

const Stack = createNativeStackNavigator();

const screens = [
  {
    name: 'Home',
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: 'DevSensor',
    component: DevSensorScreen,
  },
  {
    name: 'ScanQr',
    component: ScanQrScreen,
    options: { title: 'Scan QR Code' },
  },
  {
    name: 'Sensor',
    component: SensorScreen,
    options: { title: 'Sensors' },
  },
];

const screenOptions = () => ({
  header: props => <Header {...props} />,
});

const navigationTheme = {
  colors: {
    primary: 'black',
    text: 'black',
    background: 'black',
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
