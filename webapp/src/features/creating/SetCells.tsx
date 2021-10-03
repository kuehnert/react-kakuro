import { setErrorAlert } from 'features/alerts/alertSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveStep } from 'store/designSlice';
import validatePuzzle from 'utils/validateGrid';
import { RootState } from '../../store/store';
import DesignPanel from './DesignPanel';
import DrawGrid from './DrawGrid';

const SetCells: React.FC = () => {
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const handleNext = () => {
    const res = validatePuzzle(puzzle);
    if (res.valid) {
      dispatch(setActiveStep(activeStep + 1));
    } else {
      dispatch(setErrorAlert(res.message));
    }
  };

  return (
    <DesignPanel handleBack={handleBack} handleNext={handleNext}>
      <DrawGrid />
    </DesignPanel>
  );
};

export default SetCells;
