import { InputText } from 'primereact/inputtext';
import { Slider } from 'primereact/slider';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnCount, setName, setRowCount } from 'store/designSlice';
import { RootState } from '../../store/store';

const SetSize: React.FC = () => {
  const dispatch = useDispatch();
  const {
    puzzle: { name, columnCount, rowCount },
  } = useSelector((state: RootState) => state.design);

  return (
    <div className='p-grid'>
      <div className='p-col'>
        <h5>Spielname</h5>
        <InputText value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className='p-col'>
        <h5>Breite: {columnCount}</h5>
        <Slider
          value={columnCount}
          onChange={e => dispatch(setColumnCount(e.value as number))}
          min={5}
          max={40}
        />
      </div>

      <div className='p-col'>
        <h5>Höhe: {rowCount}</h5>
        <Slider
          value={rowCount}
          onChange={e => dispatch(setRowCount(e.value as number))}
          min={5}
          max={40}
        />
      </div>
    </div>
  );
};

export default SetSize;
