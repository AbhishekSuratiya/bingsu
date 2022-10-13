import React from 'react';
import Navigator from './Navigator';
import { Provider } from 'react-redux';
import store from '../redux/store';
import InitialiseAws from './InitialiseAws';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <Provider store={store}>
      <InitialiseAws>
        <Navigator />
      </InitialiseAws>
    </Provider>
  );
};

export default App;
