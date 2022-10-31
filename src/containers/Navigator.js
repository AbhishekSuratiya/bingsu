import React, { useContext, useEffect } from 'react';
import { Linking, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/molecules/Header/Header';
import ScanQrScreen from '../components/screens/ScanQrScreen/ScanQrScreen';
import SensorScreen from '../components/screens/SensorScreen/SensorScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../theme/Colors';
import { InfoSvg, QrCodeSvg, SensorSvg } from '../../assets/images/svg';
import RNBootSplash from 'react-native-bootsplash';
import LearnMoreScreen from '../components/screens/LearnMoreScreen/LearnMoreScreen';
import { LEARN_MORE_LINK } from '../utils/contants';
import { useNetInfo } from '@react-native-community/netinfo';
import NoInternetToast from '../components/molecules/NoInternetToast/NoInternetToast';
import { LoggerContext } from './Logger';

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
  {
    name: 'LearnMore',
    component: LearnMoreScreen,
    options: {
      title: 'Learn More',
      tabBarActiveTintColor,
      tabBarInactiveTintColor,
      unmountOnBlur: true,
      tabBarIcon: e => {
        return (
          <InfoSvg
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
  const netInfo = useNetInfo();
  const cloudWatchLog = useContext(LoggerContext);
  useEffect(() => {
    if (netInfo?.isConnected) {
      cloudWatchLog('Has internet access');
    }
  }, [netInfo?.isConnected]);
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
          onReady={() => setTimeout(RNBootSplash.hide, 4000)}>
          <Tab.Navigator screenOptions={screenOptions}>
            {tabScreens.map(({ name, component, options }) => {
              return (
                <Tab.Screen
                  key={name}
                  name={name}
                  component={component}
                  options={options}
                  listeners={{
                    tabPress: e => {
                      if (name === 'LearnMore') {
                        e.preventDefault();
                        cloudWatchLog('Opening learn more URL');
                        Linking.openURL(LEARN_MORE_LINK);
                      } else if (name === 'ScanQr') {
                        cloudWatchLog('Focused scan qr screen');
                      } else {
                        cloudWatchLog('Focused sensor screen');
                      }
                    },
                  }}
                />
              );
            })}
          </Tab.Navigator>
          {!netInfo?.isConnected && <NoInternetToast />}
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default Navigator;
