import React from 'react';
import Navigator from './Navigator';
import { Provider } from 'react-redux';
import store from '../redux/store';
import InitialiseAws from './InitialiseAws';

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
