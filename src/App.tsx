import MyMenu from 'components/MyMenu';
import CreateGame from 'features/creating/CreateGame';
import MainMenu from 'features/menu/MainMenu';
import PlayGame from 'features/playing/PlayGame';
import myHistory from 'myHistory';
import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import store from './store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MyMenu />

      <Router history={myHistory}>
        <Switch>
          <Route path='/create'>
            <CreateGame />
          </Route>
          <Route path='/play'>
            <PlayGame />
          </Route>
          <Route path='/'>
            <MainMenu />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
