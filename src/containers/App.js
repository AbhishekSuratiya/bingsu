import React from 'react';
import Navigator from './Navigator';
import { Provider } from 'react-redux';
import store from '../redux/store';
import InitialiseAws from './InitialiseAws';
import { LogBox } from 'react-native';
import Logger from './Logger';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

const App = () => {
  useKeepAwake();
  return (
    <Provider store={store}>
      <InitialiseAws>
        <Logger>
          <Navigator />
        </Logger>
      </InitialiseAws>
    </Provider>
  );
};

export default App;
