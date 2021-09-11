import React from 'react';
import GameGrid from './components/GameGrid';
import Controls from './components/Controls';
import './App.scss';

function App() {
  return (
    <div className="content">
      <header className="header">
        Mister K.ʼs Kakuro
      </header>

      <GameGrid />
      <Controls />

      <div className="footer">Made by Mister K.</div>
    </div>
  );
}

export default App;
