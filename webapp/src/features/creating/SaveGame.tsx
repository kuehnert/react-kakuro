import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkGame, solveGame } from 'store/designSlice';
import { setCurrentGame } from 'store/gameSlice';
import { RootState } from '../../store/store';
import styles from './SaveGame.module.scss';

const SaveGame: React.FC = () => {
  const { puzzle } = useSelector((state: RootState) => state.design);
  const dispatch = useDispatch();

  const handleCheck = () => {
    dispatch(checkGame());
  };

  const handleSolve = () => {
    dispatch(solveGame());
  };

  const handleSend = () => {
    dispatch(setCurrentGame(puzzle));
    // dispatch(clearDesignGame());
    // localStorage.removeItem('puzzle');
    // myHistory.push('/play');
  };

  return (
    <>
      <h5>Save {puzzle.name}</h5>
      <Button
        label='Check Validity'
        icon='mdi mdi-hand-okay'
        onClick={handleCheck}
        className={styles.button}
      />

      <Button
        label='Solve'
        icon='mdi mdi-brain'
        onClick={handleSolve}
        className={styles.button}
      />

      <Button
        label='Send to Server'
        icon='mdi mdi-send'
        onClick={handleSend}
        className={styles.button}
      />
    </>
  );
};

export default SaveGame;
