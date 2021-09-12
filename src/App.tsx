import { Provider } from 'react-redux';
import React from 'react';
import GameGrid from './components/GameGrid';
import Controls from './components/Controls';
import './App.scss';
import store from './store/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className='content'>
        <header className='header'>Mister K.ʼs Kakuro</header>

        <GameGrid />
        <Controls />

        <div className='footer'>Made by Mister K.</div>
      </div>
    </Provider>
  );
};

export default App;
