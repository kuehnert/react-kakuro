import { Provider } from 'react-redux';
import React from 'react';
import GameGrid from './features/playing/GameGrid';
import Controls from './components/Controls';
import './App.scss';
import store from './store/store';
import CombinationLine from 'components/CombinationLine';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <header className='header'>Mister K.ʼs Kakuro</header>

      <div className='content'>
        <GameGrid />
        <Controls />
      </div>

      <CombinationLine />
    </Provider>
  );
};

export default App;
