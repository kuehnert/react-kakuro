import classNames from 'classnames';
import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearDesignGame,
  createGame,
  setActiveStep,
  setPuzzleState,
  solveGame,
} from 'store/designSlice';
import { setCurrentGame } from 'store/gameSlice';
import { IGameData, PuzzleStates } from 'models/cellModels';
import { checkAllSolved } from 'utils/checkPuzzle';
import { makePencilmarks, singlePencilmarksToGuess } from 'utils/pencilmarks';
import { RootState } from '../../store/store';
import DesignPanel from './DesignPanel';
import DrawGrid from './DrawGrid';
import styles from './SaveGame.module.scss';

const SaveGame: React.FC = () => {
  const dispatch = useDispatch();
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const handlePlay = () => {
    dispatch(setCurrentGame(puzzle));
    myHistory.push('/play');
  };

  const handleSolve = () => {
    dispatch(solveGame());
  };

  const handleSolveStep = () => {
    const newPuzzle: IGameData = JSON.parse(JSON.stringify(puzzle));
    makePencilmarks(newPuzzle);
    singlePencilmarksToGuess(newPuzzle);

    if (checkAllSolved(newPuzzle)) {
      newPuzzle.state = PuzzleStates.Solved;
    }

    dispatch(setPuzzleState({ puzzle: newPuzzle, activeStep }));
  };

  const handleSolveMultiple = () => {
    const newPuzzle: IGameData = JSON.parse(JSON.stringify(puzzle));
    makePencilmarks(newPuzzle);
    while (singlePencilmarksToGuess(newPuzzle)) {
      makePencilmarks(newPuzzle);
    }

    if (checkAllSolved(newPuzzle)) {
      newPuzzle.state = PuzzleStates.Solved;
    }

    dispatch(setPuzzleState({ puzzle: newPuzzle, activeStep }));
  };

  const handleSend = () => {
    dispatch(createGame(puzzle));
  };

  const handleClear = () => {
    dispatch(clearDesignGame());
  };

  useEffect(() => {
    // handleSolveStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DesignPanel handleBack={handleBack}>
      <>
        <Button
          label='Solve Step'
          icon='mdi mdi-brain'
          onClick={handleSolveStep}
          className={styles.button}
        />

        <Button
          label='Solve Multiple'
          icon='mdi mdi-brain'
          onClick={handleSolveMultiple}
          className={styles.button}
        />

        <Button
          label='Solve Puzzle'
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
          label='Play Locally'
          icon='mdi mdi-play'
          onClick={handlePlay}
          className={styles.button}
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
