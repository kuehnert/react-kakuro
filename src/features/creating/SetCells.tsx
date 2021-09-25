import { InputText } from 'primereact/inputtext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from 'store/designSlice';
import { RootState } from '../../store/store';

const SetCells: React.FC = () => {
  const dispatch = useDispatch();
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
