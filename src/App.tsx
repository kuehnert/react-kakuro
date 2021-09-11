import React from 'react';
import GameGrid from './components/GameGrid';
import Controls from './components/Controls';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <h1>Mister K.ʼs Kakuro</h1>
      </header>

      <div className={styles.main}>
        <GameGrid />
        <Controls />
      </div>
    </div>
  );
}

export default App;
