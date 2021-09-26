import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Steps } from 'primereact/steps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  designSteps,
  setActiveStep,
  setDesignGame,
  clearDesignGame,
} from 'store/designSlice';
import { RootState } from '../../store/store';
import styles from './CreateGame.module.scss';
import DrawGrid from './DrawGrid';
import SetCells from './SetCells';
import SetSize from './SetSize';
import { Toolbar } from 'primereact/toolbar';
import { setCurrentGame } from 'store/gameSlice';
import myHistory from 'myHistory';

const CreateGame: React.FC = () => {
  const dispatch = useDispatch();
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );

  const flipView = (nextStep: number) => {
    dispatch(setActiveStep(nextStep));
    localStorage.setItem('puzzle', JSON.stringify(puzzle));
  };

  useEffect(() => {
    const puzzleJSON = localStorage.getItem('puzzle');
    if (puzzleJSON) {
      console.log('Found puzzle in local storage');
      const loadedPuzzle = JSON.parse(puzzleJSON);
      dispatch(setDesignGame(loadedPuzzle));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    dispatch(setCurrentGame(puzzle));
    dispatch(clearDesignGame());
    localStorage.removeItem('puzzle');
    myHistory.push('/');
  };

  const leftButtons = (
    <>
      <Button
        label='Zurück'
        icon='mdi mdi-arrow-left'
        onClick={e => flipView(activeStep - 1)}
        disabled={activeStep === 0}
      />
      <Button
        label='Weiter'
        icon='mdi mdi-arrow-right'
        onClick={e => flipView(activeStep + 1)}
        disabled={activeStep === designSteps.length - 1}
      />
      <Button
        label='Übernehmen'
        icon='mdi mdi-hand-okay'
        onClick={handleSubmit}
        disabled={activeStep !== designSteps.length - 1}
      />
    </>
  );

  return (
    <div className={styles.createGame}>
      <Panel header={`Create A New Puzzle: ${designSteps[activeStep].label}`}>
        <div className={styles.createSteps}>
          <Steps model={designSteps} activeIndex={activeStep} />
        </div>

        {activeStep === 0 && <SetSize />}
        {activeStep === 1 && <SetCells />}
        <DrawGrid />
      </Panel>

      <Toolbar left={leftButtons} />
    </div>
  );
};

export default CreateGame;
