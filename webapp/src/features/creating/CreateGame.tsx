import { Panel } from 'primereact/panel';
import { Steps } from 'primereact/steps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { designSteps, setPuzzleState } from 'store/designSlice';
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
    const puzzleStateJSON = localStorage.getItem('puzzleState');
    if (puzzleStateJSON) {
      console.log('Found puzzle in local storage');
      const state = JSON.parse(puzzleStateJSON);
      dispatch(setPuzzleState(state));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
