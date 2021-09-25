import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { designSteps, setActiveStep, setPuzzle } from 'store/designSlice';
import { RootState } from '../../store/store';
import styles from './CreateGame.module.scss';
import DrawGrid from './DrawGrid';
import SetCells from './SetCells';
import SetSize from './SetSize';

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
      console.log("Found puzzle in local storage");
      const loadedPuzzle = JSON.parse(puzzleJSON);
      dispatch(setPuzzle(loadedPuzzle));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.createGame}>
      <Card>
        <h1>Create a new game</h1>
        <Steps model={designSteps} activeIndex={activeStep} />
      </Card>

      <Card title={designSteps[activeStep].label}>
        {activeStep === 0 && <SetSize />}
        {activeStep === 1 && <SetCells />}
      </Card>

      <DrawGrid />

      <Button
        label='Zurück'
        onClick={e => flipView(activeStep - 1)}
        disabled={activeStep === 0}
      />
      <Button
        label='Weiter'
        onClick={e => flipView(activeStep + 1)}
        disabled={activeStep === designSteps.length - 1}
      />
    </div>
  );
};

export default CreateGame;
