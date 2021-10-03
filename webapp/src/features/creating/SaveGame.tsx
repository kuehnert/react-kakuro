import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkGame, createGame, solveGame } from 'store/designSlice';
import { PuzzleStates, setCurrentGame } from 'store/gameSlice';
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
    dispatch(createGame(puzzle));
  };

  return (
    <>
      <h5>
        Save {puzzle.name} {puzzle.state}
      </h5>
      <Button
        label='Check Validity'
        icon='mdi mdi-hand-okay'
        onClick={handleCheck}
        className={styles.button}
        disabled={puzzle.state >= PuzzleStates.Valid}
      />

      <Button
        label='Solve'
        icon='mdi mdi-brain'
        onClick={handleSolve}
        className={styles.button}
        disabled={puzzle.state !== PuzzleStates.Valid}
      />

      <Button
        label='Send to Server & Play'
        icon='mdi mdi-send'
        onClick={handleSend}
        className={styles.button}
        disabled={puzzle.state !== PuzzleStates.Solved}
      />
    </>
  );
};

export default SaveGame;
