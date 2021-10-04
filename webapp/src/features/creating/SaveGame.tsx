import { InputTextarea } from 'primereact/inputtextarea';
import classNames from 'classnames';
import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
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
  const [exportVisible, setExportVisible] = useState(false);
  const [puzzleJSON, setPuzzleJSON] = useState('');
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setPuzzleJSON(JSON.stringify(puzzle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

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
          label='Play Locally'
          icon='mdi mdi-play'
          onClick={handlePlay}
          className={styles.button}
        />

        <Button
          label='Export Puzzle'
          icon='mdi mdi-export'
          onClick={() => setExportVisible(true)}
          className={styles.button}
        />

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

        <Dialog
          header='Spiel exportieren'
          visible={exportVisible}
          style={{ width: '50vw' }}
          modal
          onHide={() => setExportVisible(false)}>
          <InputTextarea
            rows={8}
            style={{ width: '100%' }}
            value={puzzleJSON}
          />
        </Dialog>
      </>

      <DrawGrid />
    </DesignPanel>
  );
};

export default SaveGame;
