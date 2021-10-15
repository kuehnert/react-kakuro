/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { importPuzzle } from 'features/list/listSlice';
import PuzzleList from 'features/list/PuzzleList';
import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentGame } from 'store/gameSlice';
import { RootState } from 'store/store';
import makePlayable from 'utils/makePlayable';
import styles from './MainMenu.module.scss';

// menneske is <rows> x <columns>
const puzzleSizes = [
  {label: ' 8x8', value: '8x8'},
  {label: '10x10', value: '10x10'},
  {label: '13x10', value: '10x13'},
  {label: '13x13', value: '13x13'},
  {label: '15x15', value: '15x15'},
  {label: '20x20', value: '20x20'},
  {label: '25x25', value: '25x25'},
  {label: '30x15', value: '15x30'},
  {label: '30x30', value: '30x30'},
];

const MainMenu: React.FC = () => {
  const { choice } = useSelector((state: RootState) => state.list);
  const [puzzleSize, setPuzzleSize] = useState('20x20');
  const dispatch = useDispatch();

  const handleFetch = () => {
    dispatch(importPuzzle(puzzleSize));
  };

  const handlePlay = () => {
    const newPuzzle = makePlayable(choice!);
    dispatch(setCurrentGame(newPuzzle));
    myHistory.push('/play');
  };

  return (
    <div className={styles.content}>
      <div className={classNames('text-center')}>
        <div className='mb-3 font-bold text-2xl'>
          <span className='text-900'>The best </span>
          <span className='text-blue-600'>Kakuro Game </span>
          <span className='text-900'>money can buy</span>
        </div>
        <div className='text-700 text-sm mb-6'>
          All of this is work in progress, so be patient and stay tuned.
        </div>

        <div className='flex flex-row justify-content-center'>
          <Dropdown
            value={puzzleSize}
            options={puzzleSizes}
            onChange={e => setPuzzleSize(e.value)}
            placeholder='Select a Grid Size'
          />

          <Button
            label='Fetch game'
            icon='mdi mdi-download-network'
            className='p-button-lg'
            onClick={handleFetch}
          />
          <Button
            label='Create game'
            icon='mdi mdi-pencil'
            className='p-button-lg'
            onClick={e => myHistory.push('/create')}
          />
          <Button
            label='Play Game!'
            icon='mdi mdi-controller-classic'
            className='p-button-lg'
            onClick={handlePlay}
            disabled={!choice}
          />
        </div>

        <div className=''>
          <PuzzleList />
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
