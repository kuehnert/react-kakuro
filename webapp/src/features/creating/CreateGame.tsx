import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Steps } from 'primereact/steps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { designSteps, DesignStepsEnum, makeHintCells, setActiveStep, setDesignGame } from 'store/designSlice';
import { RootState } from '../../store/store';
import styles from './CreateGame.module.scss';
import DrawGrid from './DrawGrid';
import SaveGame from './SaveGame';
import SetSize from './SetSize';

const CreateGame: React.FC = () => {
  const dispatch = useDispatch();
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );

  const flipView = (nextStep: number) => {
    if (activeStep === DesignStepsEnum.DrawGrid && nextStep === DesignStepsEnum.InsertHints ) {
      dispatch(makeHintCells());
    }

    dispatch(setActiveStep(nextStep));
    // TODO: remove localStorage
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

  const headerTemplate = (options: any) => {
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>
          Step {activeStep + 1}: {designSteps[activeStep].label}
        </span>

        <span className={titleClassName}>
          <Button
            label='Back'
            icon='mdi mdi-arrow-left'
            onClick={e => flipView(activeStep - 1)}
            disabled={activeStep === 0}
          />
          <Button
            label='Next'
            icon='mdi mdi-arrow-right'
            onClick={e => flipView(activeStep + 1)}
            disabled={activeStep === designSteps.length - 1}
          />
        </span>
      </div>
    );
  };

  return (
    <div className={styles.createGame}>
      <Panel header='Create a new Kakuro puzzle'>
        <div className={styles.createSteps}>
          <Steps model={designSteps} activeIndex={activeStep} />
        </div>
      </Panel>

      <Panel headerTemplate={headerTemplate}>
        {activeStep === 0 && <SetSize />}
        {/* {activeStep === 1 && <SetCells />} */}
        {activeStep === 3 && <SaveGame />}

        {activeStep > 0 && <DrawGrid />}
      </Panel>
    </div>
  );
};

export default CreateGame;
