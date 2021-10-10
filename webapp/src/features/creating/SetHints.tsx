import { setErrorAlert } from 'features/alerts/alertSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeHintCells, setActiveStep } from 'store/designSlice';
import { checkPuzzle } from 'utils/checkPuzzle';
import { RootState } from '../../store/store';
import DesignPanel from './DesignPanel';
import DrawGrid from './DrawGrid';

const SetHints: React.FC = () => {
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(makeHintCells());
  });

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const handleNext = () => {
    const res = checkPuzzle(puzzle);

    if (res.valid) {
      dispatch(setActiveStep(activeStep + 1));
    } else {
      dispatch(setErrorAlert(res.error || 'Error in puzzle'));
    }
  };

  return (
    <DesignPanel handleNext={handleNext} handleBack={handleBack}>
      <DrawGrid />
      <div className='notes'>Missing hints: {puzzle.hintCount}</div>
    </DesignPanel>
  );
};

export default SetHints;
