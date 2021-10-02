import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { solveGame } from 'store/designSlice';
import { setCurrentGame } from 'store/gameSlice';
import { RootState } from '../../store/store';

const SaveGame: React.FC = () => {
  const { puzzle } = useSelector((state: RootState) => state.design);
  const dispatch = useDispatch();

  const handleSolve = () => {
    dispatch(solveGame());
  };

  const handleSubmit = () => {
    dispatch(setCurrentGame(puzzle));
    // dispatch(clearDesignGame());
    // localStorage.removeItem('puzzle');
    // myHistory.push('/play');
  };

  return (
    <>
      <h5>Save {puzzle.name}</h5>
      <Button label='Solve' icon='mdi mdi-brain' onClick={handleSolve} />
      <Button
        label='Send to Server'
        icon='mdi mdi-hand-okay'
        onClick={handleSubmit}
      />
    </>
  );
};

export default SaveGame;
