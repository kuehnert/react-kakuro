/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { IGameData } from '../data/GameData';
import loadGame from '../data/loadGame';
import styles from './GameGrid.module.scss';

const GameGrid: React.FC = () => {
  const [game, setGame] = useState<IGameData | null>(null);

  useEffect(() => {
    async function load() {
      const newGame = await loadGame();
      setGame(newGame);
    }

    if (game == null) {
      load();
    }
  }, []);

  return <div className={styles.gamegrid}>GameGrid</div>;
};

export default GameGrid;
