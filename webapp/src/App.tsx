import MyMenubar from 'components/MyMenubar';
import Routes from 'components/Routes';
import Alerts from 'features/alerts/Alerts';
import React from 'react';
import { Provider } from 'react-redux';
import './App.scss';
import store from 'store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MyMenubar />
      <Alerts />

      <Routes />
    </Provider>
  );
};

export default App;
