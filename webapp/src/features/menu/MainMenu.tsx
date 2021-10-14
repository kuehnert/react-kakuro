/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { importPuzzle } from 'features/list/listSlice';
import PuzzleList from 'features/list/PuzzleList';
import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentGame } from 'store/gameSlice';
import { RootState } from 'store/store';
import makePlayable from 'utils/makePlayable';
import styles from './MainMenu.module.scss';

const MainMenu: React.FC = () => {
  const { choice } = useSelector((state: RootState) => state.list);
  const dispatch = useDispatch();

  const handleFetch = () => {
    dispatch(importPuzzle());
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
          <div className='w-15rem h-4rem'>
            <Button
              label='Fetch game'
              icon='mdi mdi-download-network'
              className='p-button-lg'
              onClick={handleFetch}
            />
          </div>

          <div className='w-15rem h-4rem'>
            <Button
              label='Create game'
              icon='mdi mdi-pencil'
              className='p-button-lg'
              onClick={e => myHistory.push('/create')}
            />
          </div>

          <div className='w-15rem h-4rem'>
            <Button
              label='Play Game!'
              icon='mdi mdi-controller-classic'
              className='p-button-lg'
              onClick={handlePlay}
              disabled={!choice}
            />
          </div>
        </div>

        <div className=''>
          <PuzzleList />
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
