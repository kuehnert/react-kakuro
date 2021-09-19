import { Provider } from 'react-redux';
import React from 'react';
import GameGrid from './components/GameGrid';
import Controls from './components/Controls';
import './App.scss';
import store from './store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <header className='header'>Mister K.ʼs Kakuro</header>

      <div className='content'>
        <GameGrid />
        <Controls />
      </div>

      <div className='footer'>Copyright 2021</div>
    </Provider>
  );
};

export default App;
