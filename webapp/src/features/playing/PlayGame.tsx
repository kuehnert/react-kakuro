import KeyboardListener from 'components/KeyboardListener';
import myHistory from 'myHistory';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './Cell.scss';
import CombinationLine from './CombinationLine';
import Controls from './Controls';
import GameGrid from './GameGrid';
import styles from './PlayGame.module.scss';

const PlayGame: React.FC = () => {
  const { game } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (game.state < 0) {
      myHistory.push('/');
    }
  });

  return (
    <>
      <KeyboardListener />
      <div className={styles.content}>
        <GameGrid />
        <Controls />
      </div>

      <CombinationLine />
    </>
  );
};

export default PlayGame;
