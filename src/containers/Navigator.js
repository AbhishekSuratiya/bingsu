import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/screens/HomeScreen';
import Header from '../components/molecules/Header/Header';
import DevSensorScreen from '../components/screens/DevSensorScreen';
import ScanQrScreen from '../components/screens/ScanQrScreen';
import SensorScreen from '../components/screens/SensorScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../theme/Colors';
import { SensorSvg, QrCodeSvg, InfoSvg } from '../../assets/images/svg';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  // {
  //   name: 'Home',
  //   component: HomeScreen,
  //   options: {
  //     headerShown: false,
  //     tabBarActiveTintColor,
  //     tabBarInactiveTintColor,
  //     tabBarIcon: e => {
  //       return (
  //         <InfoSvg
  //           fill={e.focused ? tabBarActiveTintColor : tabBarInactiveTintColor}
  //         />
  //       );
  //     },
  //   },
  // },
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
        {/*TODO: Remove this if not required*/}
        {/*<Stack.Navigator*/}
        {/*  screenOptions={screenOptions}*/}
        {/*  initialRouteName={'Home'}>*/}
        {/*  {screens.map(({ name, component, options }) => {*/}
        {/*    return (*/}
        {/*      <Stack.Screen*/}
        {/*        key={name}*/}
        {/*        name={name}*/}
        {/*        component={component}*/}
        {/*        options={options}*/}
        {/*      />*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</Stack.Navigator>*/}

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
  );
};

export default Navigator;
