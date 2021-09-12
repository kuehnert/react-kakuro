/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { setGuess } from '../store/gameSlice';
// import styles from './BlankCell.module.scss';

export interface Props {
  digit: number;
}

const GuessButton: React.FC<Props> = ({ digit }) => {
  const { selectedIndex } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const handleGuessClick = (event: React.MouseEvent) => {
    if (digit >= 0 && digit <= 9 && selectedIndex) {
      dispatch(setGuess({ index: selectedIndex, guess: digit }));
    }
  };

  return (
    <div className='column is-4'>
      <button
        className={classnames('button', 'is-info', 'is-large')}
        onClick={handleGuessClick}>
        {digit}
      </button>
    </div>
  );
};

export default GuessButton;
