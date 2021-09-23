/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { Button } from 'primereact/button';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainMenu.module.scss';

const MainMenu: React.FC = () => {
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
        <div className='grid'>
          <div className='col-12 md:col-4 mb-4 px-5'>
            <Link to='/create'>
              <Button icon='mdi mdi-pencil' className='p-button-lg' />
            </Link>
            <div className='text-900 mb-3 font-medium'>Create new game</div>
          </div>
          <div className='col-12 md:col-4 mb-4 px-5'>
            <Link to='/play'>
              <Button
                icon='mdi mdi-controller-classic'
                className='p-button-lg'
              />
            </Link>
            <div className='text-900 mb-3 font-medium'>Play Game!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
