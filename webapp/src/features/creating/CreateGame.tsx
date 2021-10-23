import { designSteps } from 'models/designModels';
import { Panel } from 'primereact/panel';
import { Steps } from 'primereact/steps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPuzzle } from 'store/designSlice';
import { RootState } from '../../store/store';
import styles from './CreateGame.module.scss';
import SaveGame from './SaveGame';
import SetCells from './SetCells';
import SetHints from './SetHints';
import SetSize from './SetSize';

const CreateGame: React.FC = () => {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state: RootState) => state.design);

  useEffect(() => {
    const puzzleJSON = localStorage.getItem('designPuzzle');
    if (puzzleJSON) {
      console.log('Found puzzle in local storage');
      const puzzle = JSON.parse(puzzleJSON);
      dispatch(setPuzzle(puzzle));
    }
  }, [dispatch]);

  return (
    <div className={styles.createGame}>
      <Panel header='Create a new Kakuro puzzle'>
        <div className={styles.createSteps}>
          <Steps model={designSteps} activeIndex={activeStep} />
        </div>
      </Panel>

      {activeStep === 0 && <SetSize />}
      {activeStep === 1 && <SetCells />}
      {activeStep === 2 && <SetHints />}
      {activeStep === 3 && <SaveGame />}
    </div>
  );
};

export default CreateGame;
