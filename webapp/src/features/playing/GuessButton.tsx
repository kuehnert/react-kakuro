/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGuess, togglePencilMark } from '../../store/gameSlice';
import { RootState } from '../../store/store';
import styles from './GuessButton.module.scss';
import { Button } from 'primereact/button';
import classNames from 'classnames';

export interface Props {
  digit: number;
  pencilMark: boolean;
}

const GuessButton: React.FC<Props> = ({ digit, pencilMark }) => {
  const { selectedIndex } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const handleGuessClick = (event: React.MouseEvent) => {
    if (digit >= 0 && digit <= 9 && selectedIndex) {
      if (pencilMark) {
        dispatch(togglePencilMark({ index: selectedIndex, guess: digit }));
      } else {
        dispatch(setGuess({ index: selectedIndex, guess: digit }));
      }
    }
  };

  return (
    <Button
      className={classNames(styles.guessButton, { pencilMark })}
      onClick={handleGuessClick}>
      {digit}
    </Button>
  );
};

export default GuessButton;
