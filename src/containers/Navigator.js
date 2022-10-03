import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/molecules/Header/Header';
import ScanQrScreen from '../components/screens/ScanQrScreen/ScanQrScreen';
import SensorScreen from '../components/screens/SensorScreen/SensorScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../theme/Colors';
import { QrCodeSvg, SensorSvg } from '../../assets/images/svg';
import RNBootSplash from 'react-native-bootsplash';

const Tab = createBottomTabNavigator();

const tabBarActiveTintColor = Colors.blue;
const tabBarInactiveTintColor = Colors.grey80;

const tabScreens = [
  {
    name: 'Sensor',
    component: SensorScreen,
    options: {
      title: 'Sensors',
      tabBarActiveTintColor,
      tabBarInactiveTintColor,
      tabBarIcon: e => {
        return (
          <SensorSvg
            fill={e.focused ? tabBarActiveTintColor : tabBarInactiveTintColor}
          />
        );
      },
    },
  },
  {
    name: 'ScanQr',
    component: ScanQrScreen,
    options: {
      title: 'Connect to AWS',
      tabBarActiveTintColor,
      tabBarInactiveTintColor,
      unmountOnBlur: true,
      tabBarIcon: e => {
        return (
          <QrCodeSvg
            fill={e.focused ? tabBarActiveTintColor : tabBarInactiveTintColor}
          />
        );
      },
    },
  },
];

const screenOptions = () => ({
  header: props => <Header {...props} />,
  tabBarStyle: {
    height: 80,
    paddingBottom: 24,
    backgroundColor: Colors.black,
  },
});

const navigationTheme = {
  colors: {
    primary: Colors.black,
    text: Colors.black,
    background: Colors.black,
  },
};

const Navigator = () => {
  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: Colors.black }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black }}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={Colors.black}
        />
        <NavigationContainer
          theme={navigationTheme}
          onReady={() => RNBootSplash.hide()}>
          <Tab.Navigator screenOptions={screenOptions}>
            {tabScreens.map(({ name, component, options }) => {
              return (
                <Tab.Screen
                  key={name}
                  name={name}
                  component={component}
                  options={options}
                />
              );
            })}
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default Navigator;
