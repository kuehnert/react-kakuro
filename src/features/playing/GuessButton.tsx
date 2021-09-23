/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGuess } from  '../../store/gameSlice';
import { RootState } from '../../store/store';
import styles from './GuessButton.module.scss';
import { Button } from 'primereact/button';

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
    <Button className={styles.guessButton} onClick={handleGuessClick}>
      {digit}
    </Button>
  );
};

export default GuessButton;
