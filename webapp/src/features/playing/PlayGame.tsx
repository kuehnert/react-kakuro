/* eslint-disable react-hooks/exhaustive-deps */
import KeyboardListener from 'components/KeyboardListener';
import myHistory from 'myHistory';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IGameData, setGameState } from 'store/gameSlice';
import { RootState } from '../../store/store';
import './Cell.scss';
import CombinationLine from './CombinationLine';
import Controls from './Controls';
import GameGrid from './GameGrid';
import styles from './PlayGame.module.scss';

const PlayGame: React.FC = () => {
  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    if (game.state >= 0) {
      return;
    }

    console.log('Loading game state...');
    const res = localStorage.getItem('currentGame');
    if (res) {
      const newGame: IGameData = JSON.parse(res);
      dispatch(setGameState(newGame));
    } else {
      myHistory.push('/');
    }
  }, []);

  return (
    <>
      <KeyboardListener />

      <div className={styles.content}>
        <CombinationLine />
        <GameGrid />
        <Controls />
      </div>
    </>
  );
};

export default PlayGame;
