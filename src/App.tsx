import CreateGame from 'features/creating/CreateGame';
import MainMenu from 'features/menu/MainMenu';
import PlayGame from 'features/playing/PlayGame';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import store from './store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <header className='header'>Mister K.ʼs Kakuro</header>

      <Router>
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
