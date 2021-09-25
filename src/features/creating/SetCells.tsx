import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SetCells: React.FC = () => {
  const {
    puzzle: { name },
  } = useSelector((state: RootState) => state.design);

  return (
    <>
      <h5>{name}</h5>

    </>
  );
};

export default SetCells;
