import React from 'react';
import styles from './Controls.module.scss';
import classnames from 'classnames';
import GuessButton from './GuessButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { autoPencil, setGuess } from '../../store/gameSlice';
import { Button } from 'primereact/button';

/*
 * Here be number buttons for guesses and pencil marks
 */
const Controls: React.FC = () => {
  const { selectedIndex } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleDeleteClick = (event: React.MouseEvent) => {
    if (selectedIndex) {
      dispatch(setGuess({ index: selectedIndex, guess: 0 }));
    }
  };

  const handleAutoPencil = (event: React.MouseEvent) => {
    dispatch(autoPencil());
  };

  const renderButton = (digit: number, pencilMark: boolean) => {
    return <GuessButton key={digit} digit={digit} pencilMark={pencilMark} />;
  };

  return (
    <aside className={classnames('controls', styles.controls)}>
      <div className={styles.guessButtons}>
        <div className={styles.columns}>
          {digits.map(d => renderButton(d, true))}
        </div>

        <div className={styles.columns}>
          {digits.map(d => renderButton(d, false))}
        </div>

        <Button
          className={classnames('button', 'is-warning', 'is-large', styles.button)}
          onClick={handleDeleteClick}>
          X
        </Button>

        <Button
          className={classnames('button is-large', styles.button)}
          onClick={handleAutoPencil}>
          Auto Pencil
        </Button>
      </div>

      <div className='pencilmarks'></div>
    </aside>
  );
};

export default Controls;
