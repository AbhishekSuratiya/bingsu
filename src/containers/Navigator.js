import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/molecules/Header/Header';
import ScanQrScreen from '../components/screens/ScanQrScreen/ScanQrScreen';
import SensorScreen from '../components/screens/SensorScreen/SensorScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../theme/Colors';
import { InfoSvg, QrCodeSvg, SensorSvg } from '../../assets/images/svg';
import RNBootSplash from 'react-native-bootsplash';
import LearnMoreScreen from '../components/screens/LearnMoreScreen/LearnMoreScreen';
import { useNetInfo } from '@react-native-community/netinfo';
import NoInternetToast from '../components/molecules/NoInternetToast/NoInternetToast';
import { LoggerContext } from './Logger';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TermsAndConditionsScreen from '../components/screens/TermsAndConditionsScreen/TermsAndConditionsScreen';

const Tab = createBottomTabNavigator();
const LearnMoreStack = createNativeStackNavigator();

const tabBarActiveTintColor = Colors.blue;
const tabBarInactiveTintColor = Colors.grey80;

function LearnMoreMainScreen() {
  return (
    <LearnMoreStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <LearnMoreStack.Screen
        name="LearnMoreScreen"
        component={LearnMoreScreen}
      />
      <LearnMoreStack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
      />
    </LearnMoreStack.Navigator>
  );
}

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
    component: LearnMoreMainScreen,
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
                        cloudWatchLog('Opening learn more screen');
                      } else if (name === 'ScanQr') {
                        if (!netInfo?.isConnected) {
                          e.preventDefault();
                        }
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
