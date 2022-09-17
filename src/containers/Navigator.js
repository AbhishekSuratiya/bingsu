import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/screens/HomeScreen';
import AboutScreen from '../components/screens/AboutScreen';
import Header from '../components/molecules/Header/Header';

const Stack = createNativeStackNavigator();

const screens = [
  {
    name: 'Home',
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: 'About',
    component: AboutScreen,
    options: { title: 'About title' },
  },
];

const screenOptions = () => ({
  header: props => <Header {...props} />,
});

const Navigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
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
