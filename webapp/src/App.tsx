import MyMenubar from 'components/MyMenubar';
import Alerts from 'features/alerts/Alerts';
import CreateGame from 'features/creating/CreateGame';
import MainMenu from 'features/menu/MainMenu';
import PlayGame from 'features/playing/PlayGame';
import SignIn from 'features/users/SignIn';
import SignUp from 'features/users/SignUp';
import myHistory from 'myHistory';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import './App.scss';
import store from './store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MyMenubar />
      <Alerts />

      <Router history={myHistory}>
        <Switch>
          <Route path='/create'>
            <CreateGame />
          </Route>
          <Route path='/play'>
            <PlayGame />
          </Route>
          <Route path='/signin'>
            <SignIn />
          </Route>
          <Route path='/signup'>
            <SignUp />
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
