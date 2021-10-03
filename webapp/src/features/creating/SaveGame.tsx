import classNames from 'classnames';
import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearDesignGame,
  createGame,
  setActiveStep,
  solveGame,
} from 'store/designSlice';
import { PuzzleStates, setCurrentGame } from 'store/gameSlice';
import { RootState } from '../../store/store';
import DesignPanel from './DesignPanel';
import DrawGrid from './DrawGrid';
import styles from './SaveGame.module.scss';

const SaveGame: React.FC = () => {
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const handleSolve = () => {
    dispatch(solveGame());
  };

  const handleSend = () => {
    dispatch(setCurrentGame(puzzle));
    dispatch(createGame(puzzle));
  };

  const handleClear = () => {
    dispatch(clearDesignGame());
  };

  return (
    <DesignPanel handleBack={handleBack}>
      <>
        <Button
          label='Solve'
          icon='mdi mdi-brain'
          onClick={handleSolve}
          className={styles.button}
        />

        <Button
          label='Send to Server & Play'
          icon='mdi mdi-send'
          onClick={handleSend}
          className={styles.button}
          disabled={puzzle.state !== PuzzleStates.Solved}
        />

        <Button
          label='Start Over'
          icon='mdi mdi-restart'
          onClick={handleClear}
          className={classNames(
            styles.button,
            'p-button-warning',
            'p-button-success'
          )}
        />
      </>

      <DrawGrid />
    </DesignPanel>
  );
};

export default SaveGame;
